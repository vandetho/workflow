import Transition from '../Transition';

export interface MetadataStoreInterface {
    getWorkflowMetadata(): { [key: string]: any };

    getPlaceMetadata(place: string): { [key: string]: any };

    getTransitionMetadata(transition: Transition): { [key: string]: any };

    /**
     * Returns the metadata for a specific subject.
     *
     * This is a proxy method.
     *
     * @param {string} key                     Use null to get workflow metadata
     * @param {string|Transition|null} subject Use null to get workflow metadata
     *                                         Use a string (the place name) to get place metadata
     *                                         Use a Transition instance to get transition metadata
     */
    getMetadata(key: string, subject: string | Transition | null): any;
}
