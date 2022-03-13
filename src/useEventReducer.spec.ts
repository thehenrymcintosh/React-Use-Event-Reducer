import { act, renderHook } from "@testing-library/react-hooks";
import { Handlers, useEventReducer } from "./useEventReducer";

type Events = {
  append: string;
  clear: void;
  clearAndAppend: string;
};

type State = string;

const handlers: Handlers<State, Events> = {
  append: (state, payload) => `${state}${payload}`,
  clear: () => ``,
  clearAndAppend: (state, payload, emit) => {
    emit.clear();
    emit.append(payload);
    return state;
  },
};

describe("useEventReducer", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Executes expected handler function", () => {
    jest.spyOn(handlers, "append");
    const { result } = renderHook(() => useEventReducer(handlers, ""));
    act(() => {
      result.current.emit.append("test");
    });
    expect(result.current.state).toBe("test");
    expect(handlers.append).toHaveBeenCalledTimes(1);
  });

  it("Can emit events for other handlers", () => {
    jest.spyOn(handlers, "append");
    const { result } = renderHook(() => useEventReducer(handlers, "ing"));
    act(() => {
      result.current.emit.clearAndAppend("test");
    });
    expect(result.current.state).toBe("test");
    expect(handlers.append).toHaveBeenCalledTimes(1);
  });
});
