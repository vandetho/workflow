import TransitionBlockerList from './TransitionBlockerList';
import Marking from './Marking';
import Transition from './Transition';
import Definition from './Definition';
import { MarkingStoreInterface } from './markingStore';
import { MetadataStoreInterface } from './metadata';

export interface WorkflowInterface {
    /**
     * Returns the object's Marking.
     *
     * @throws LogicError
     */
      getMarking(subject: any): Marking;

    /**
     * Returns true if the transition is enabled.
     */
      can(subject: any,  transitionName: string): boolean;

    /**
     * Builds a TransitionBlockerList to know why a transition is blocked.
     */
      buildTransitionBlockerList(subject: any, transitionName: string ): TransitionBlockerList;

    /**
     * Fire a transition.
     *
     * @throws LogicException If the transition is not applicable
     */
      apply( subject: any, transitionName: string , context: {[key: string]: any}): Marking;

    /**
     * Returns all enabled transitions.
     *
     * @return Transition[]
     */
      getEnabledTransitions(subject: any): Transition[];

      getName(): string;

      getDefinition(): Definition;

      getMarkingStore(): MarkingStoreInterface;

      getMetadataStore(): MetadataStoreInterface;
}
