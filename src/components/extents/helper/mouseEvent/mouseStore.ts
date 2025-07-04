// mouseStore.ts
import { createStore } from "solid-js/store";

export type Point = { x: number; y: number };

type MouseGestureStore = {
  start: Point | null;
  end: Point | null;
  lastAction: "click" | "dragDownRelease" | "dragging" | "longpress" | null;
};

export const [mouseGesture, setMouseGesture] = createStore<MouseGestureStore>({
  start: null,
  end: null,
  lastAction: null,
});
