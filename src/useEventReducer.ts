import { ReducerAction, useCallback, useMemo, useReducer } from "react";

export type Handlers<State, Events> = {
  [Key in keyof Events]: (state: State, payload: Events[Key]) => State;
};

type Action<Events, K extends keyof Events> = {
  event: K;
  payload: Events[K];
};

interface EventReducer<State, Events> {
  <K extends keyof Events>(state: State, action: Action<Events, K>): State;
}
type Emitter<Payload> = Payload extends undefined
  ? (payload?: undefined) => void
  : (payload: Payload) => void;

export type Emitters<Events> = {
  [K in keyof Events]: Emitter<Events[K]>;
};

export function useEventReducer<State, Events extends Record<string, any>>(
  handlers: Handlers<State, Events>,
  initial: State
): { state: State; emit: Emitters<Events> } {
  type Event = keyof Events;

  const reducer: EventReducer<State, Events> = useCallback(
    (state, { event, payload }) => {
      return handlers[event](state, payload);
    },
    [handlers]
  );

  const [state, dispatch] = useReducer(reducer, initial);

  const emit = useMemo(() => {
    const events = Object.keys(handlers) as Event[];
    return events.reduce((emitters, event) => {
      emitters[event] = ((payload: Events[Event]) =>
        dispatch({
          event,
          payload,
        } as ReducerAction<EventReducer<State, Events>>)) as Emitter<
        Events[Event]
      >;
      return emitters;
    }, {} as Emitters<Events>);
  }, [handlers, dispatch]);

  return { state, emit };
}
