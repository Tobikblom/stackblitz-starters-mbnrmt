import { useEffect, useReducer } from 'react';

type CounterState = {
  count: number;
};

type CounterAction = { type: 'increment' } | { type: 'decrement' };

const countReducer = (
  state: CounterState,
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case 'increment': {
      return {
        count: state.count + 1,
      };
    }
    case 'decrement': {
      return {
        count: state.count - 1,
      };
    }
    default: {
      throw new Error('Unknown action');
    }
  }
};

const initialCounter: CounterState = {
  count: 0,
};

export default function Batch() {
  const [counter, dispatch] = useReducer(countReducer, initialCounter);

  function add(n: number) {
    for (let i = 0; i < n; i++) {
      dispatch({ type: 'increment' });
    }
  }

  function subtract(n: number) {
    for (let i = 0; i < n; i++) {
      dispatch({ type: 'decrement' });
    }
  }

  useEffect(() => {
    console.log('render');
  });

  return (
    <>
      <button onClick={() => add(3)}>Add 3</button>
      <button onClick={() => subtract(3)}>Subtract 3</button>
      <span>{counter.count}</span>
    </>
  );
}
