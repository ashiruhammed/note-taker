import { atom } from "nanostores";

export const $state = atom("dashboard");
export const $openedTab = atom("");
export function setState(value: string) {
  $state.set(value);
}

export function setOpenedTab(value: string) {
  $openedTab.set(value);
}

// self.addEventListener("co");
