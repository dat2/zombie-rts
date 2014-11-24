export default class StateMachine {
 constructor(initialState, states = []) {
  this.states = states;
  this.transitionFn = {};

  this.currentState = initialState;
 }

 addTransition(startState, resultState, predicate) {
  if(this.transitionFn[startState] === undefined) {
    this.transitionFn[startState] = [];
  }
  this.transitionFn[startState].push({
    predicate,
    resultState
  });
 }

 transition(input) {
  let tests = this.transitionFn[this.currentState];
  if(tests === undefined) {
    return;
  }
  tests.some( (test) => {
    let result = test.predicate.call(null, input);
    if(result) {
      this.currentState = test.resultState;
    }
    return result;
  });
 }
}