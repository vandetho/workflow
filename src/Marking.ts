import { Context } from 'workflow';

class Marking {
    private places: { [key: string]: 1 } = {};
    private context: Context | null = null;

    /**
     * @param {{[key: string]: 1}} representation Keys are the place name and values should be 1
     */
    constructor(representation: { [key: string]: number } = {}) {
        Object.keys(representation).forEach((representation) => {
            this.mark(representation);
        });
    }

    public mark(place: string): void {
        this.places[place] = 1;
    }

    public unmark(place: string): void {
        delete this.places[place];
    }

    public has(place: string) {
        return this.places[place] === 1;
    }

    public getPlaces(): { [key: string]: number } {
        return this.places;
    }

    /**
     * @internal
     */
    public setContext(context: Context): void {
        this.context = context;
    }

    /**
     * Returns the context after the subject has transitioned.
     */
    public getContext() {
        return this.context;
    }
}

export default Marking;
