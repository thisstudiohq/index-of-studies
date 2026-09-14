import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";

interface IntroContextValue {
	isLoaded: boolean;
	notifyModelLoaded: () => void;
}

const defaultIntroValue: IntroContextValue = {
	isLoaded: true,
	notifyModelLoaded: () => {},
};

const IntroContext = createContext<IntroContextValue>(defaultIntroValue);

export function useIntro(): IntroContextValue {
	return useContext(IntroContext);
}

interface IntroProviderProps {
	children: ReactNode;
}

export function IntroProvider({ children }: IntroProviderProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const isModelLoadedRef = useRef(false);
	const isFontsReadyRef = useRef(false);

	const checkReadiness = useCallback(() => {
		if (isModelLoadedRef.current && isFontsReadyRef.current) {
			setIsLoaded(true);
		}
	}, []);

	const notifyModelLoaded = useCallback(() => {
		isModelLoadedRef.current = true;
		checkReadiness();
	}, [checkReadiness]);

	useEffect(() => {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			setIsLoaded(true);
			return;
		}

		if (document.fonts?.ready) {
			document.fonts.ready.then(() => {
				isFontsReadyRef.current = true;
				checkReadiness();
			});
		} else {
			isFontsReadyRef.current = true;
			checkReadiness();
		}

		// Fallback timeout to ensure entrance plays even on slow networks
		const fallbackTimer = window.setTimeout(() => {
			setIsLoaded(true);
		}, 1200);

		return () => {
			window.clearTimeout(fallbackTimer);
		};
	}, [checkReadiness]);

	return (
		<IntroContext.Provider
			value={{
				isLoaded,
				notifyModelLoaded,
			}}
		>
			{children}
		</IntroContext.Provider>
	);
}
