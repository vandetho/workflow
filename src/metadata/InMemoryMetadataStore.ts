import { MetadataStoreInterface } from './MetadataStoreInterface';
import Transition from '../Transition';

class InMemoryMetadataStore implements MetadataStoreInterface {
    private readonly workflowMetadata: { [key: string]: any } = {};
    private readonly placesMetadata: { [key: string]: { [key: string]: any } } = {};
    private transitionsMetadata: Map<Transition, { [key: string]: any }>;

    /**
     * @param { [key: string]: any} workflowMetadata
     * @param { [key: string]: any} placesMetadata
     * @param {Map<Transition, { [key: string]: any}>|null} transitionsMetadata
     */
    public constructor(
        workflowMetadata: { [key: string]: any } = {},
        placesMetadata: { [key: string]: any } = {},
        transitionsMetadata: Map<Transition, { [key: string]: any }> | null = null,
    ) {
        this.workflowMetadata = workflowMetadata;
        this.placesMetadata = placesMetadata;
        this.transitionsMetadata = transitionsMetadata ?? new Map<Transition, { [key: string]: any }>();
    }

    public getWorkflowMetadata(): { [key: string]: any } {
        return this.workflowMetadata;
    }

    public getPlaceMetadata(place: string): { [key: string]: any } {
        return this.placesMetadata[place] ?? {};
    }

    public getTransitionMetadata(transition: Transition): { [key: string]: any } {
        return this.transitionsMetadata.get(transition) ?? {};
    }

    public getMetadata(key: string, subject: string | Transition | null = null) {
        if (null === subject) {
            return this.getWorkflowMetadata()[key] ?? null;
        }

        const metadataBag =
            typeof subject === 'string' ? this.getPlaceMetadata(subject) : this.getTransitionMetadata(subject);

        return metadataBag[key] ?? null;
    }
}

export default InMemoryMetadataStore;
