import Marking from '../Marking';

export interface MarkingStoreInterface {
    /**
     * Gets a Marking from a subject.
     */
    getMarking(subject: any): Marking;

    /**
     * Sets a Marking to a subject.
     */
    setMarking(subject: any, marking: Marking, context?: { [key: string]: any }): void;
}
