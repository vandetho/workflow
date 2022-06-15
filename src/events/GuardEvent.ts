import TransitionBlockerList from '../TransitionBlockerList';
import Marking from '../Marking';

class GuardEvent {
    private transitionBlockerList: TransitionBlockerList;

    /**
     * {@inheritdoc}
     */
    public  constructor(subject: any,  marking: Marking,  transition: Transition,  workflow: WorkflowInterface|null = null)
{
    super(subject, marking, transition, workflow);

    this->transitionBlockerList = new TransitionBlockerList();
}

public  getTransition(): Transition
{
    return parent::getTransition();
}

public  isBlocked(): bool
{
    return !this->transitionBlockerList->isEmpty();
}

public  setBlocked(bool blocked, string message = null): void
    {
        if (!blocked) {
    this->transitionBlockerList->clear();

    return;
}

this->transitionBlockerList->add(TransitionBlocker::createUnknown(message));
}

public  getTransitionBlockerList(): TransitionBlockerList
{
    return this->transitionBlockerList;
}

public  addTransitionBlocker(TransitionBlocker transitionBlocker): void
    {
        this->transitionBlockerList->add(transitionBlocker);
}
}

export default GuardEvent;
