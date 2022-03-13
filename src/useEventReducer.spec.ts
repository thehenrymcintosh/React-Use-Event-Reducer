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
  clearAndAppend: (_, payload) => {
    return handlers.append("", payload);
  },
};

describe("useEventReducer", () => {
  it("Executes expected handler function", () => {
    const { result } = renderHook(() => useEventReducer(handlers, ""));
    act(() => {
      result.current.emit.append("test");
    });
    expect(result.current.state).toBe("test");
  });

  it("Executes expected handler sequentially", () => {
    const { result } = renderHook(() => useEventReducer(handlers, ""));
    act(() => {
      result.current.emit.append("test");
      result.current.emit.append("ing");
    });
    expect(result.current.state).toBe("testing");
  });

  it("Can internally call other handlers handlers", () => {
    const { result } = renderHook(() => useEventReducer(handlers, "ing"));
    act(() => {
      result.current.emit.clearAndAppend("test");
    });
    expect(result.current.state).toBe("test");
  });
});
