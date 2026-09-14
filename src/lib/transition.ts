import { createContext } from "react";

export type TransitionApi = {
	to: (href: string) => void;
};

export const TransitionContext = createContext<TransitionApi>({
	to: (href) => {
		window.location.assign(href);
	},
});
