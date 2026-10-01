import type { NavigateFunction, NavigateOptions, To } from "react-router-dom";

let navigator: NavigateFunction | null = null;

export const setNavigator = (navigate: NavigateFunction) => {
 navigator = navigate;
};

export const navigateTo = (to: To, options?: NavigateOptions) => {
 navigator?.(to, options);
};
