enum WorkflowEvents {
    /**
     * @Event("Symfony\Component\Workflow\Event\GuardEvent")
     */
    GUARD = 'workflow.guard',

    /**
     * @Event("Symfony\Component\Workflow\Event\LeaveEvent")
     */
    LEAVE = 'workflow.leave',

    /**
     * @Event("Symfony\Component\Workflow\Event\TransitionEvent")
     */
    TRANSITION = 'workflow.transition',

    /**
     * @Event("Symfony\Component\Workflow\Event\EnterEvent")
     */
    ENTER = 'workflow.enter',

    /**
     * @Event("Symfony\Component\Workflow\Event\EnteredEvent")
     */
    ENTERED = 'workflow.entered',

    /**
     * @Event("Symfony\Component\Workflow\Event\CompletedEvent")
     */
    COMPLETED = 'workflow.completed',

    /**
     * @Event("Symfony\Component\Workflow\Event\AnnounceEvent")
     */
    ANNOUNCE = 'workflow.announce',

    /**
     * Event aliases.
     *
     * These aliases can be consumed by RegisterListenersPass.
     */
    ALIASES = {
        GuardEvent::class

:
self::GUARD,
    LeaveEvent::class
:
self::LEAVE,
    TransitionEvent::class
:
self::TRANSITION,
    EnterEvent::class
:
self::ENTER,
    EnteredEvent::class
:
self::ENTERED,
    CompletedEvent::class
:
self::COMPLETED,
    AnnounceEvent::class
:
self::ANNOUNCE,
},
}
