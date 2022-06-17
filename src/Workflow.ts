import { WorkflowEvents } from './WorkflowEvents';
import { MetadataStoreInterface } from './metadata';
import Definition from './Definition';
import TransitionBlocker from './TransitionBlocker';
import MethodMarkingStore from './markingStore/MethodMarkingStore';
import TransitionBlockerList from './TransitionBlockerList';
import Marking from './Marking';
import Transition from './Transition';
import { MarkingStoreInterface } from './markingStore';
import { LogicError, NotEnabledTransitionError, UndefinedTransitionError } from './exceptions';
import {
    AnnounceEvent,
    CompletedEvent,
    EnteredEvent,
    EnterEvent,
    GuardEvent,
    LeaveEvent,
    TransitionEvent,
} from './events';
import { EventEmitter } from 'events';
import { Context } from 'workflow';

class Workflow {
    public DISABLE_LEAVE_EVENT = 'workflow_disable_leave_event';
    public DISABLE_TRANSITION_EVENT = 'workflow_disable_transition_event';
    public DISABLE_ENTER_EVENT = 'workflow_disable_enter_event';
    public DISABLE_ENTERED_EVENT = 'workflow_disable_entered_event';
    public DISABLE_COMPLETED_EVENT = 'workflow_disable_completed_event';
    public DISABLE_ANNOUNCE_EVENT = 'workflow_disable_announce_event';

    public DEFAULT_INITIAL_CONTEXT = { initial: true };

    private DISABLE_EVENTS_MAPPING: { [key: string]: string } = {
        [WorkflowEvents.LEAVE]: this.DISABLE_LEAVE_EVENT,
        [WorkflowEvents.TRANSITION]: this.DISABLE_TRANSITION_EVENT,
        [WorkflowEvents.ENTER]: this.DISABLE_ENTER_EVENT,
        [WorkflowEvents.ENTERED]: this.DISABLE_ENTERED_EVENT,
        [WorkflowEvents.COMPLETED]: this.DISABLE_COMPLETED_EVENT,
        [WorkflowEvents.ANNOUNCE]: this.DISABLE_ANNOUNCE_EVENT,
    };

    private readonly definition: Definition;
    private readonly markingStore: MarkingStoreInterface;
    private readonly name: string;
    private readonly eventsToDispatch = [];

    private dispatcher: EventEmitter;

    public constructor(
        definition: Definition,
        markingStore: MarkingStoreInterface | null = null,
        name = 'unnamed',
        eventsToDispatch = [],
    ) {
        this.definition = definition;
        this.eventsToDispatch = eventsToDispatch;
        this.markingStore = markingStore ?? new MethodMarkingStore();
        this.name = name;
        this.dispatcher = new EventEmitter();
    }

    /**
     * {@inheritdoc}
     */
    public getMarking(subject: any, context: Context = []): Marking {
        const marking = this.markingStore.getMarking(subject);

        // check if the subject is already in the workflow
        if (!marking.getPlaces()) {
            if (!this.definition.getInitialPlaces()) {
                throw new LogicError(`The Marking is empty and there is no initial place for workflow "${this.name}".`);
            }
            this.definition.getInitialPlaces().forEach((place) => {
                marking.mark(place);
            });

            this.markingStore.setMarking(subject, marking);

            if (!context) {
                context = this.DEFAULT_INITIAL_CONTEXT;
            }

            this.entered(subject, null, marking, context);
        }

        const places = this.definition.getPlaces();
        Object.keys(marking.getPlaces()).forEach((placeName) => {
            if (!places[placeName]) {
                let message = `Place "${placeName}" is not valid for workflow "${this.name}".`;
                if (!places) {
                    message += ' It seems you forgot to add places to the current workflow.';
                }
                throw new LogicError(message);
            }
        });

        return marking;
    }

    /**
     * {@inheritdoc}
     */
    public can(subject: any, transitionName: string): boolean {
        const transitions = this.definition.getTransitions();
        const marking = this.getMarking(subject);
        return transitions.some((transition) => {
            if (transition.getName() === transitionName) {
                const transitionBlockerList = this.buildTransitionBlockerListForTransition(
                    subject,
                    marking,
                    transition,
                );
                return transitionBlockerList.isEmpty();
            }
            return false;
        });
    }

    /**
     * {@inheritdoc}
     */
    public buildTransitionBlockerList(subject: any, transitionName: string): TransitionBlockerList | null {
        const transitions = this.definition.getTransitions();
        const marking = this.getMarking(subject);
        let transitionBlockerList = null;
        for (const transition of transitions) {
            if (transition.getName() === transitionName) {
                transitionBlockerList = this.buildTransitionBlockerListForTransition(subject, marking, transition);

                if (transitionBlockerList.isEmpty()) {
                    return transitionBlockerList;
                }

                if (!transitionBlockerList.has(TransitionBlocker.BLOCKED_BY_MARKING)) {
                    return transitionBlockerList;
                }
            }
        }

        if (!transitionBlockerList) {
            throw new UndefinedTransitionError(subject, transitionName, this);
        }

        return transitionBlockerList;
    }

    /**
     * {@inheritdoc}
     */
    public apply(subject: any, transitionName: string, context: Context = {}): Marking {
        const marking = this.getMarking(subject, context);
        const approvedTransitions: Transition[] = [];
        let transitionExist = false;
        let bestTransitionBlockerList: TransitionBlockerList | null = null;

        for (const transition of this.definition.getTransitions()) {
            if (transition.getName() === transitionName) {
                transitionExist = true;
                const tmpTransitionBlockerList = this.buildTransitionBlockerListForTransition(
                    subject,
                    marking,
                    transition,
                );

                if (tmpTransitionBlockerList.isEmpty()) {
                    approvedTransitions.push(transition);
                    continue;
                }

                if (!bestTransitionBlockerList) {
                    bestTransitionBlockerList = tmpTransitionBlockerList;
                    continue;
                }

                if (!tmpTransitionBlockerList.has(TransitionBlocker.BLOCKED_BY_MARKING)) {
                    bestTransitionBlockerList = tmpTransitionBlockerList;
                }
            }
        }

        if (!transitionExist) {
            throw new UndefinedTransitionError(subject, transitionName, this, context);
        }

        if (!approvedTransitions.length) {
            throw new NotEnabledTransitionError(subject, transitionName, this, bestTransitionBlockerList, context);
        }

        for (const transition of approvedTransitions) {
            this.leave(subject, transition, marking, context);

            context = this.transition(subject, transition, marking, context);

            this.enter(subject, transition, marking, context);

            this.markingStore.setMarking(subject, marking, context);

            this.entered(subject, transition, marking, context);

            this.completed(subject, transition, marking, context);

            this.announce(subject, transition, marking, context);
        }

        marking.setContext(context);

        return marking;
    }

    /**
     * {@inheritdoc}
     */
    public getEnabledTransitions(subject: any): Transition[] {
        const enabledTransitions: Transition[] = [];
        const marking = this.getMarking(subject);
        for (const transition of this.definition.getTransitions()) {
            const transitionBlockerList = this.buildTransitionBlockerListForTransition(subject, marking, transition);

            if (transitionBlockerList.isEmpty()) {
                enabledTransitions.push(transition);
            }
        }

        return enabledTransitions;
    }

    public getEnabledTransition(subject: any, name: string): Transition | null {
        const marking = this.getMarking(subject);

        for (const transition of this.definition.getTransitions()) {
            if (transition.getName() === name) {
                const transitionBlockerList = this.buildTransitionBlockerListForTransition(
                    subject,
                    marking,
                    transition,
                );
                if (transitionBlockerList.isEmpty()) {
                    return transition;
                }
            }
        }
        return null;
    }

    /**
     * {@inheritdoc}
     */
    public getName(): string {
        return this.name;
    }

    /**
     * {@inheritdoc}
     */
    public getDefinition(): Definition {
        return this.definition;
    }

    /**
     * {@inheritdoc}
     */
    public getMarkingStore(): MarkingStoreInterface {
        return this.markingStore;
    }

    /**
     * {@inheritdoc}
     */
    public getMetadataStore(): MetadataStoreInterface {
        return this.definition.getMetadataStore();
    }

    private buildTransitionBlockerListForTransition(
        subject: any,
        marking: Marking,
        transition: Transition,
    ): TransitionBlockerList {
        for (const place of transition.getFroms()) {
            if (!marking.has(place)) {
                return new TransitionBlockerList([TransitionBlocker.createBlockedByMarking(marking)]);
            }
        }

        const event = this.guardTransition(subject, marking, transition);

        if (event.isBlocked()) {
            return event.getTransitionBlockerList();
        }

        return new TransitionBlockerList();
    }

    private guardTransition(subject: any, marking: Marking, transition: Transition): GuardEvent {
        const event = new GuardEvent(subject, marking, transition, this);

        this.dispatcher.emit(WorkflowEvents.GUARD, event);
        this.dispatcher.emit(`workflow.${this.name}.guard`, this.name, event);
        this.dispatcher.emit(`workflow.${this.name}.guard.${transition.getName()}`, this.name, event);

        return event;
    }

    private leave(subject: any, transition: Transition, marking: Marking, context: Context = []): void {
        const places = transition.getFroms();
        if (this.shouldDispatchEvent(WorkflowEvents.LEAVE, context)) {
            const event = new LeaveEvent(subject, marking, transition, this, context);

            this.dispatcher.emit(WorkflowEvents.LEAVE, event);
            this.dispatcher.emit(`workflow.${this.name}.leave`, event);

            for (const place of places) {
                this.dispatcher.emit(`workflow.${this.name}.leave.${place}`, event);
            }
        }

        for (const place of places) {
            marking.unmark(place);
        }
    }

    private transition(subject: any, transition: Transition, marking: Marking, context: Context): Context {
        if (!this.shouldDispatchEvent(WorkflowEvents.TRANSITION, context)) {
            return context;
        }

        const event = new TransitionEvent(subject, marking, transition, this, context);

        this.dispatcher.emit(WorkflowEvents.TRANSITION, event);
        this.dispatcher.emit(`workflow.${this.name}.transition`, event);
        this.dispatcher.emit(`workflow.${this.name}.transition.${transition.getName()}`, event);

        return event.getContext();
    }

    private enter(subject: any, transition: Transition, marking: Marking, context: Context): void {
        const places = transition.getTos();

        if (this.shouldDispatchEvent(WorkflowEvents.ENTER, context)) {
            const event = new EnterEvent(subject, marking, transition, this, context);

            this.dispatcher.emit(WorkflowEvents.ENTER, event);
            this.dispatcher.emit(`workflow.${this.name}.enter`, event);

            for (const place of places) {
                this.dispatcher.emit(`workflow.${this.name}.enter.${place}`, event);
            }
        }

        for (const place of places) {
            marking.mark(place);
        }
    }

    private entered(subject: any, transition: Transition | null, marking: Marking, context: Context): void {
        if (!this.shouldDispatchEvent(WorkflowEvents.ENTERED, context)) {
            return;
        }

        const event = new EnteredEvent(subject, marking, transition, this, context);

        this.dispatcher.emit(WorkflowEvents.ENTERED, event);
        this.dispatcher.emit(`workflow.${this.name}.entered`, event);

        for (const place of Object.keys(marking.getPlaces())) {
            this.dispatcher.emit(`workflow.${this.name}.entered.${place}`, event);
        }
    }

    private completed(subject: any, transition: Transition, marking: Marking, context: Context): void {
        if (!this.shouldDispatchEvent(WorkflowEvents.COMPLETED, context)) {
            return;
        }

        const event = new CompletedEvent(subject, marking, transition, this, context);

        this.dispatcher.emit(WorkflowEvents.COMPLETED, event);
        this.dispatcher.emit(`workflow.${this.name}.completed`, event);
        this.dispatcher.emit(`workflow.${this.name}.completed.${transition.getName()}`, event);
    }

    private announce(subject: any, initialTransition: Transition, marking: Marking, context: Context): void {
        if (!this.shouldDispatchEvent(WorkflowEvents.ANNOUNCE, context)) {
            return;
        }

        const event = new AnnounceEvent(subject, marking, initialTransition, this, context);

        this.dispatcher.emit(WorkflowEvents.ANNOUNCE, event);
        this.dispatcher.emit(`workflow.${this.name}.announce`, event);

        for (const transition of this.getEnabledTransitions(subject)) {
            this.dispatcher.emit(`workflow.${this.name}.announce.${transition.getName()}`, event);
        }
    }

    private shouldDispatchEvent(eventName: string, context: Context): boolean {
        if (context[this.DISABLE_EVENTS_MAPPING[eventName]]) {
            return false;
        }

        if (null === this.eventsToDispatch) {
            return true;
        }

        if (this.eventsToDispatch.length === 0) {
            return false;
        }

        return this.eventsToDispatch.some((event) => eventName === event);
    }
}

export default Workflow;
