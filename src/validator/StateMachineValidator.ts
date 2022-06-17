import { DefinitionValidatorInterface } from './DefinitionValidatorInterface';
import Definition from '../Definition';
import { InvalidDefinitionError } from '../exceptions';

class StateMachineValidator implements DefinitionValidatorInterface {
    public validate(definition: Definition, name: string): void {
        const transitionFromNames: { [key: string]: { [key: string]: any } } = {};
        for (const transition of definition.getTransitions()) {
            // Make sure that each transition has exactly one TO
            if (1 !== transition.getTos().length) {
                throw new InvalidDefinitionError(
                    `A transition in StateMachine can only have one output. But the transition "${transition.getName()}" in StateMachine "${name}" has ${
                        transition.getTos().length
                    } outputs.`,
                );
            }

            const froms = transition.getFroms();
            if (1 !== froms.length) {
                throw new InvalidDefinitionError(
                    `A transition in StateMachine can only have one input. But the transition "${transition.getName()}" in StateMachine "${name}" has ${
                        froms.length
                    } inputs.`,
                );
            }

            const from = froms[0];
            if (transitionFromNames[from][transition.getName()]) {
                throw new InvalidDefinitionError(
                    `A transition from a place/state must have an unique name. Multiple transitions named "${transition.getName()}" from place/state "${from}" were found on StateMachine "${name}".`,
                );
            }

            transitionFromNames[from][transition.getName()] = true;
        }

        const initialPlaces = definition.getInitialPlaces();
        if (2 <= initialPlaces.length) {
            throw new InvalidDefinitionError(
                `The state machine "${name}" cannot store many places. But the definition has ${initialPlaces.length} initial places. Only one is supported.`,
            );
        }
    }
}

export default StateMachineValidator;
