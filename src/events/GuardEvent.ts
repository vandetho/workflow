import TransitionBlockerList from '../TransitionBlockerList';
import Marking from '../Marking';
import Event from './Event';
import Transition from '../Transition';
import TransitionBlocker from '../TransitionBlocker';
import Workflow from '../Workflow';

class GuardEvent extends Event {
    private readonly transitionBlockerList: TransitionBlockerList;

    /**
     * {@inheritdoc}
     */
    public constructor(subject: any, marking: Marking, transition: Transition, workflow: Workflow | null = null) {
        super(subject, marking, transition, workflow);

        this.transitionBlockerList = new TransitionBlockerList();
    }

    public isBlocked(): boolean {
        return !this.transitionBlockerList.isEmpty();
    }

    public setBlocked(blocked: boolean, message: string | null = null): void {
        if (!blocked) {
            this.transitionBlockerList.clear();

            return;
        }

        this.transitionBlockerList.add(TransitionBlocker.createUnknown(message));
    }

    public getTransitionBlockerList(): TransitionBlockerList {
        return this.transitionBlockerList;
    }

    public addTransitionBlocker(transitionBlocker: TransitionBlocker): void {
        this.transitionBlockerList.add(transitionBlocker);
    }
}

export default GuardEvent;
