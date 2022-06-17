import Workflow from './Workflow';
import { InvalidArgumentError } from './exceptions';
import { InstanceOfSupportStrategy } from './supportStrategy';

class Registry {
    private workflows: Array<any[]> = [];

    public addWorkflow(workflow: Workflow, supportStrategy: InstanceOfSupportStrategy) {
        this.workflows.push([workflow, supportStrategy]);
    }

    public has(subject: any, workflowName: string | null = null): boolean {
        for (const [workflow, supportStrategy] of this.workflows) {
            if (Registry.supports(workflow, supportStrategy, subject, workflowName)) {
                return true;
            }
        }

        return false;
    }

    public get(subject: any, workflowName: string | null = null): Workflow {
        const matched: Workflow[] = [];

        for (const [workflow, supportStrategy] of this.workflows) {
            if (Registry.supports(workflow, supportStrategy, subject, workflowName)) {
                matched.push(workflow);
            }
        }

        if (!matched) {
            throw new InvalidArgumentError(`Unable to find a workflow for class "${subject.class}".`);
        }

        if (2 <= matched.length) {
            const names = matched.map((workflow): string => {
                return workflow.getName();
            }, matched);

            throw new InvalidArgumentError(
                `Too many workflows (${names.join(', ')}) match this subject (${
                    subject.class
                }); set a different name on each and use the second (name) argument of this method.`,
            );
        }

        return matched[0];
    }

    /**
     * @return Workflow[]
     */
    public all(subject: any): Workflow[] {
        const matched: Workflow[] = [];

        for (const [workflow, supportStrategy] of this.workflows) {
            if (supportStrategy.supports(workflow, subject)) {
                matched.push(workflow);
            }
        }

        return matched;
    }

    private static supports(
        workflow: Workflow,
        supportStrategy: InstanceOfSupportStrategy,
        subject: any,
        workflowName: string | null,
    ): boolean {
        if (null !== workflowName && workflowName !== workflow.getName()) {
            return false;
        }

        return supportStrategy.supports(workflow, subject);
    }
}

export default Registry;
