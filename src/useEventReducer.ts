import { ReducerAction, useCallback, useMemo, useReducer } from "react";

export type Handlers<State, Events> = {
  [Key in keyof Events]: (
    state: State,
    payload: Events[Key],
    emitters: Emitters<Events>
  ) => State;
};

type Action<Events, K extends keyof Events> = {
  eventType: K;
  payload: Events[K];
  emitters: Emitters<Events>;
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
    (state, { eventType, payload, emitters }) => {
      return handlers[eventType](state, payload, emitters);
    },
    [handlers]
  );

  const [state, dispatch] = useReducer(reducer, initial);

  const emit = useMemo(() => {
    const localEmitterRef = Object.keys(handlers).reduce(
      (emitBuilder, _eventType) => {
        const eventType = _eventType as Event;
        emitBuilder[eventType] = ((payload: Events[Event]) =>
          dispatch({
            eventType,
            payload,
            emitters: localEmitterRef,
          } as ReducerAction<EventReducer<State, Events>>)) as Emitter<
          Events[Event]
        >;
        return emitBuilder;
      },
      {} as Emitters<Events>
    );
    return localEmitterRef;
  }, [handlers]);

  return { state, emit };
}
