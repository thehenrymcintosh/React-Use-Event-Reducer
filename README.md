<hr>
<div align="center">
  <h1 align="center">
    useEventReducer()
  </h1>
</div>

<pre align="center">npm i react-use-event-reducer</pre>
<hr>

A React hook for leveraging useReducer with strongly typed events, each with a separate handler.

## Quick Start

Create your custom hook to manage your state

```jsx harmony
// useAppendOnlyString.ts
import { useEventReducer, Handlers } from "react-use-event-reducer";

// Specify the type of your state
type State = {
  text: string,
};

// Specify your events and the expected payload
type Events = {
  Append: {
    text: string,
    repetitions: number,
  },
  Clear: void,
};

// Create your strongly typed handlers
const handlers: Handlers<State, Events> = {
  Append: (state: State, payload) => {
    // return new state
    return {
      text: `${state.text}${payload.text.repeat(payload.repetitions)}`,
    };
  },
  Clear: () => ({ text: "" }),
};

export const useAppendOnlyString = (initialState: State) =>
  useEventReducer(handlers, initialState);
```

Use your custom hook

```jsx harmony
// ExampleComponent.ts
import React from "react";
import { useAppendOnlyString } from "./useAppendOnlyString";

const ExampleComponent: React.FC = () => {
  const { state, emit } = useAppendOnlyString({ text: "" });

  return (
    <div>
      <h1>{state.text}</h1>
      <button onClick={emit.Append("hello world")}>Append</button>
      <button onClick={emit.Clear()}>Clear</button>
    </div>
  );
};
```
