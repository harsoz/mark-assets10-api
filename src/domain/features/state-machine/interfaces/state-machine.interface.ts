export interface IStateMachine{
    getStatefulMachine(state: string): any;
    getStatelessMachine(): any;
}