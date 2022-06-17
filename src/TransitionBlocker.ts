import Marking from './Marking';

class TransitionBlocker {
    public static BLOCKED_BY_MARKING = 'e0ff04a9-eba7-4208-a974-d48e38c0cb27';
    public static BLOCKED_BY_EXPRESSION_GUARD_LISTENER = '52c00b18-3743-4266-9986-3d695328dff0';
    public static UNKNOWN = 'e2cca226-0fdd-4cf2-8d06-e86e3d4def5a';

    private readonly message: string = '';
    private readonly code: string = '';
    private readonly parameters: { [key: string]: any } = {};

    /**
     * @param  {string} message      Message
     * @param  {string} code       Code is a machine-readable string, usually a UUID
     * @param  {{[key: string]: any}}  parameters  This is useful if you would like to pass around the condition values, that
     *                           blocked the transition. E.g. for a condition "distance must be larger than
     *                           5 miles", you might want to pass around the value of 5.
     */
    constructor(message: string, code: string, parameters: { [key: string]: any } = {}) {
        this.message = message;
        this.code = code;
        this.parameters = parameters;
    }

    /**
     * Create a blocker that says the transition cannot be made because it is
     * not enabled.
     *
     * It means the subject is in wrong place (i.e. status):
     * * If the workflow is a state machine: the subject is not in the previous place of the transition.
     * * If the workflow is a workflow: the subject is not in all previous places of the transition.
     */
    public static createBlockedByMarking(marking: Marking) {
        return new TransitionBlocker('The marking does not enable the transition.', this.BLOCKED_BY_MARKING, {
            marking: marking,
        });
    }

    /**
     * Creates a blocker that says the transition cannot be made because it has
     * been blocked by the expression guard listener.
     */
    public static createBlockedByExpressionGuardListener(expression: string) {
        return new TransitionBlocker(
            'The expression blocks the transition.',
            this.BLOCKED_BY_EXPRESSION_GUARD_LISTENER,
            { expression: expression },
        );
    }

    /**
     * Creates a blocker that says the transition cannot be made because of an
     * unknown reason.
     */
    public static createUnknown(message: string | null) {
        if (null !== message) {
            return new TransitionBlocker(message, this.UNKNOWN);
        }

        const caller = new Error().stack;

        if (null !== caller) {
            return new TransitionBlocker('The transition has been blocked by a guard ($caller).', this.UNKNOWN);
        }

        return new TransitionBlocker('The transition has been blocked by a guard.', this.UNKNOWN);
    }

    public getMessage(): string {
        return this.message;
    }

    public getCode(): string {
        return this.code;
    }

    public getParameters(): { [key: string]: any } {
        return this.parameters;
    }
}

export default TransitionBlocker;
