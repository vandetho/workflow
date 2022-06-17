import Transition from './Transition';
import { InMemoryMetadataStore, MetadataStoreInterface } from './metadata';
import { LogicError } from './exceptions';

class Definition {
    private places: { [key: string]: string } = {};
    private transitions: Transition[] = [];
    private initialPlaces: string[] = [];
    private readonly metadataStore: MetadataStoreInterface;

    /**
     * @param {string[]}             places
     * @param {Transition[]}         transitions
     * @param {string|string[]|null} initialPlaces
     * @param {MetadataStoreInterface|null} metadataStore
     */
    public constructor(
        places: { [key: string]: string },
        transitions: Transition[],
        initialPlaces: string | string[] | null = null,
        metadataStore: MetadataStoreInterface | null = null,
    ) {
        Object.keys(places).forEach((place) => {
            this.addPlace(place);
        });

        transitions.forEach((transition) => {
            this.addTransition(transition);
        });

        this.setInitialPlaces(initialPlaces);

        this.metadataStore = metadataStore ?? new InMemoryMetadataStore();
    }

    /**
     * @return string[]
     */
    public getInitialPlaces(): string[] {
        return this.initialPlaces;
    }

    /**
     * @return string[]
     */
    public getPlaces(): { [key: string]: string } {
        return this.places;
    }

    /**
     * @return Transition[]
     */
    public getTransitions(): Transition[] {
        return this.transitions;
    }

    public getMetadataStore(): MetadataStoreInterface {
        return this.metadataStore;
    }

    private setInitialPlaces(places: string | string[] | null = null) {
        if (!places) {
            return;
        }
        const initialPlaces = Array.isArray(places) ? places : [places];

        initialPlaces.forEach((place) => {
            if (this.places[place] === undefined) {
                throw new LogicError(`Place "${place}" cannot be the initial place as it does not exist.`);
            }
        });

        this.initialPlaces = initialPlaces;
    }

    private addPlace(place: string): void {
        if (Object.keys(this.places).length === 0) {
            this.initialPlaces = [place];
        }

        this.places[place] = place;
    }

    private addTransition(transition: Transition): void {
        const name = transition.getName();

        transition.getFroms().forEach((from) => {
            if (this.places[from] === undefined) {
                throw new LogicError(`Place "${from}" referenced in transition "${name}" does not exist.`);
            }
        });

        transition.getTos().forEach((to) => {
            if (this.places[to] === undefined) {
                throw new LogicError(`Place "${to}" referenced in transition "${name}" does not exist.`);
            }
        });

        this.transitions.push(transition);
    }
}

export default Definition;
