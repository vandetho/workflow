class Transition {
    private readonly name: string;
    private readonly froms: string[];
    private readonly tos: string[];

    /**
     * @param {string} name
     * @param {string|string[]} froms
     * @param {string|string[]} tos
     */
    public constructor(name: string, froms: string | string[], tos: string | string[]) {
        this.name = name;
        this.froms = Array.isArray(froms) ? froms : [froms];
        this.tos = Array.isArray(tos) ? tos : [tos];
    }

    public getName(): string {
        return this.name;
    }

    /**
     * @return string[]
     */
    public getFroms(): string[] {
        return this.froms;
    }

    /**
     * @return string[]
     */
    public getTos(): string[] {
        return this.tos;
    }
}

export default Transition;
