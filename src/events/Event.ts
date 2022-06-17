import Marking from '../Marking';
import Transition from '../Transition';
import Workflow from '../Workflow';
import { Context } from 'workflow';

class Event {
    protected context: Context;
    private readonly subject: any;
    private readonly marking: Marking;
    private readonly transition: Transition | null;
    private readonly workflow: Workflow | null;

    constructor(
        subject: any,
        marking: Marking,
        transition: Transition | null = null,
        workflow: Workflow | null = null,
        context: Context = {},
    ) {
        this.subject = subject;
        this.marking = marking;
        this.transition = transition;
        this.workflow = workflow;
        this.context = context;
    }

    /**
     * @return Marking
     */
    public getMarking() {
        return this.marking;
    }

    /**
     * @return object
     */
    public getSubject() {
        return this.subject;
    }

    /**
     * @return Transition|null
     */
    public getTransition() {
        return this.transition;
    }

    public getWorkflow(): Workflow | null {
        return this.workflow;
    }

    /**
     * @return string
     */
    public getWorkflowName(): string | undefined {
        return this.workflow?.getName();
    }

    public getMetadata(key: string, subject: string | Transition | null) {
        return this.workflow?.getMetadataStore().getMetadata(key, subject);
    }

    public getContext(): { [key: string]: any } {
        return this.context;
    }
}

export default Event;
