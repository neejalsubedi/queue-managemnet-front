// src/utils/loadingBus.ts
type Listener = (on: boolean) => void;

let listeners: Listener[] = [];

export function onGlobalLoading(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function emitGlobalLoading(on: boolean) {
  for (const l of listeners) l(on);
}

// Optional helpers if you ever need them outside axios:
export const startGlobalLoading = () => emitGlobalLoading(true);
export const stopGlobalLoading = () => emitGlobalLoading(false);