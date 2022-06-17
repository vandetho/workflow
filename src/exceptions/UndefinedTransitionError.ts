import Workflow from '../Workflow';

class UndefinedTransitionError extends Error {
    constructor(subject: any, transitionName: string, workflow: Workflow, context?: { [key: string]: any }) {
        super();
    }
}

export default UndefinedTransitionError;
