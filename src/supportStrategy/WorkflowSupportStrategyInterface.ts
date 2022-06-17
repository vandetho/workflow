import Workflow from '../Workflow';

export interface WorkflowSupportStrategyInterface {
    supports(workflow: Workflow, subject: any): boolean;
}
