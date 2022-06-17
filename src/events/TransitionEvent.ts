import Event from './Event';
import { Context } from 'workflow';

class TransitionEvent extends Event {
    public setContext(context: Context): void {
        this.context = context;
    }
}

export default TransitionEvent;
