import Workflow from '../Workflow';
import TransitionBlockerList from '../TransitionBlockerList';

class NotEnabledTransitionError extends Error {
    constructor(
        subject: any,
        transitionName: string,
        workflow: Workflow,
        transitionBlockerList: TransitionBlockerList | null,
        context?: { [key: string]: any },
    ) {
        super();
    }
}

export default NotEnabledTransitionError;
