import capitalize from 'capitalize';
import { LogicError } from '../exceptions';
import Marking from '../Marking';

class MethodMarkingStore {
    private readonly singleState: boolean;
    private readonly property: string;

    /**
     * @param {boolean} singleState
     * @param {string} property Used to determine methods to call
     *                         The `getMarking` method will use `subject.getProperty()`
     *                         The `setMarking` method will use `subject.setProperty(string|array places, array context = array())`
     */
    constructor(singleState = false, property = 'marking') {
        this.singleState = singleState;
        this.property = property;
    }

    /**
     * {@inheritdoc}
     */
    public getMarking(subject: any): Marking {
        const method = 'get' + capitalize(this.property);

        if (typeof subject[method] !== 'function') {
            throw new LogicError(`The method "${subject.name}::${method}()" does not exist.`);
        }

        let marking = subject[method]();

        if (null === marking) {
            return new Marking();
        }

        if (this.singleState) {
            marking = { [marking]: 1 };
        }

        return new Marking(marking);
    }

    /**
     * {@inheritdoc}
     */
    public setMarking(subject: any, marking: Marking, context: { [key: string]: any } = {}) {
        const method = 'set' + capitalize(this.property);

        if (typeof subject[method] !== 'function') {
            throw new LogicError(`The method "${subject.name}::${method}()" does not exist.`);
        }
        subject[method](marking.getPlaces(), context);
    }
}

export default MethodMarkingStore;
