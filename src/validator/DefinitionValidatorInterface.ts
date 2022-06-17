import Definition from '../Definition';

export interface DefinitionValidatorInterface {
    validate(definition: Definition, name: string): void;
}
