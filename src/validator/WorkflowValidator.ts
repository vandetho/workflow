import { DefinitionValidatorInterface } from './DefinitionValidatorInterface';
import Definition from '../Definition';
import { InvalidDefinitionError } from '../exceptions';

class WorkflowValidator implements DefinitionValidatorInterface {
    private readonly singlePlace: boolean;

    constructor(singlePlace = false) {
        this.singlePlace = singlePlace;
    }

    public validate(definition: Definition, name: string): void {
        const places: { [key: string]: any[] } = {};
        Object.keys(definition.getPlaces()).forEach((place) => (places[place] = []));
        for (const transition of definition.getTransitions()) {
            for (const from of transition.getFroms()) {
                if (places[from].some((transitionName) => transitionName === transition.getName())) {
                    throw new InvalidDefinitionError(
                        `All transitions for a place must have an unique name. Multiple transitions named "${transition.getName()}" where found for place "${from}" in workflow "${name}".`,
                    );
                }
                places[from].push(transition.getName());
            }
        }

        if (!this.singlePlace) {
            return;
        }

        for (const transition of definition.getTransitions()) {
            if (1 < transition.getTos().length) {
                throw new InvalidDefinitionError(
                    `The marking store of workflow "${name}" cannot store many places. But the transition "${transition.getName()}" has too many output (${transition.getTos()}). Only one is accepted.`,
                );
            }
        }

        const initialPlaces = definition.getInitialPlaces();
        if (2 <= initialPlaces.length) {
            throw new InvalidDefinitionError(
                `The marking store of workflow "${name}" cannot store many places. But the definition has ${initialPlaces.length} initial places. Only one is supported.`,
            );
        }
    }
}

export default WorkflowValidator;
