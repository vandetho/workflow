import TransitionBlocker from './TransitionBlocker';

class TransitionBlockerList {
    private blockers: TransitionBlocker[];

    /**
     * @param {TransitionBlocker[]} blockers
     */
    public constructor(blockers: TransitionBlocker[] = []) {
        this.blockers = [];
        blockers.forEach((blocker) => {
            this.add(blocker);
        });
    }

    public add(blocker: TransitionBlocker): void {
        this.blockers.push(blocker);
    }

    public has(code: string): boolean {
        return this.blockers.some((blocker) => {
            return code === blocker.getCode();
        });
    }

    public clear(): void {
        this.blockers = [];
    }

    public isEmpty(): boolean {
        return !this.blockers;
    }

    public count(): number {
        return this.blockers.length;
    }
}

export default TransitionBlockerList;
