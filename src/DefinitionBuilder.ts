import Transition from './Transition';
import Definition from './Definition';
import { MetadataStoreInterface } from './metadata';

class DefinitionBuilder {
    private places: { [key: string]: string } = {};
    private transitions: Transition[] = [];
    private initialPlaces: string | string[] | null = null;
    private metadataStore: MetadataStoreInterface | null = null;

    /**
     * @param {{[key: string]: string}} places
     * @param {Transition[]}            transitions
     */
    public constructor(places: { [key: string]: string } = {}, transitions: Transition[] = []) {
        this.addPlaces(places);
        this.addTransitions(transitions);
    }

    public build(): Definition {
        return new Definition(this.places, this.transitions, this.initialPlaces, this.metadataStore);
    }

    /**
     * Clear all data in the builder.
     *
     * @return this
     */
    public clear(): this {
        this.places = {};
        this.transitions = [];
        this.initialPlaces = null;
        this.metadataStore = null;

        return this;
    }

    /**
     * @param {string|string[]|null} initialPlaces
     *
     * @return this
     */
    public setInitialPlaces(initialPlaces: string | string[] | null): this {
        this.initialPlaces = initialPlaces;

        return this;
    }

    /**
     * @return this
     */
    public addPlace(place: string): this {
        if (!this.places) {
            this.initialPlaces = place;
        }

        this.places[place] = place;

        return this;
    }

    /**
     * @param {{[key: string]: string}} places
     *
     * @return this
     */
    public addPlaces(places: { [key: string]: string }): this {
        for (const place of Object.keys(places)) {
            this.addPlace(place);
        }

        return this;
    }

    /**
     * @param {Transition[]} transitions
     *
     * @return this
     */
    public addTransitions(transitions: Transition[]): this {
        for (const transition of transitions) {
            this.addTransition(transition);
        }

        return this;
    }

    /**
     * @return this
     */
    public addTransition(transition: Transition): this {
        this.transitions.push(transition);

        return this;
    }

    /**
     * @return this
     */
    public setMetadataStore(metadataStore: MetadataStoreInterface): this {
        this.metadataStore = metadataStore;

        return this;
    }
}

export default DefinitionBuilder;
