import Definition from './Definition';
import { MarkingStoreInterface } from './markingStore';
import Workflow from './Workflow';
import MethodMarkingStore from './markingStore/MethodMarkingStore';

class StateMachine extends Workflow {
    public constructor(
        definition: Definition,
        markingStore: MarkingStoreInterface | null = null,
        name: string = 'unnamed',
        eventsToDispatch = [],
    ) {
        super(definition, markingStore ?? new MethodMarkingStore(true), name, eventsToDispatch);
    }
}

export default StateMachine;
