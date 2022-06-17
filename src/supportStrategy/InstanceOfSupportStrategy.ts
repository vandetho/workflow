import Workflow from '../Workflow';
import { WorkflowSupportStrategyInterface } from './WorkflowSupportStrategyInterface';

class InstanceOfSupportStrategy implements WorkflowSupportStrategyInterface {
    private readonly className: string;

    public constructor(className: string) {
        this.className = className;
    }

    /**
     * {@inheritdoc}
     */
    public supports(workflow: Workflow, subject: any): boolean {
        return subject.class === this.className;
    }

    public getClassName(): string {
        return this.className;
    }
}

export default InstanceOfSupportStrategy;
