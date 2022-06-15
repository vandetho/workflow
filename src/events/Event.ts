import Marking from '../Marking';
import Transition from '../Transition';

class Event extends BaseEvent
{
    protected context: {[key: string]: any};
    private subject: any;
    private  marking: Marking;
    private  transition: Transition|null;
    private  workflow: WorkflowInterface|null;

    constructor(subject: any,  marking: Marking,  transition: Transition | null = null,  workflow: WorkflowInterface | null = null, array context = [])
{
    this.subject = subject;
    this.marking = marking;
    this.transition = transition;
    this.workflow = workflow;
    this.context = context;
}

/**
 * @return Marking
 */
public  getMarking()
{
    return this.marking;
}

/**
 * @return object
 */
public  getSubject()
{
    return this.subject;
}

/**
 * @return Transition|null
 */
public  getTransition()
{
    return this.transition;
}

public  getWorkflow(): WorkflowInterface
{
    return this.workflow;
}

/**
 * @return string
 */
public  getWorkflowName(): string
{
    return this.workflow.getName();
}

public  getMetadata( key: string,  subject: string|Transition|null)
{
    return this.workflow.getMetadataStore().getMetadata(key, subject);
}

public  getContext(): {[key: string]: any}
{
    return this.context;
}
}

export default Event;
