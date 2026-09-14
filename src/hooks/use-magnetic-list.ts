import { type RefObject, useEffect } from "react";
import { getLenis } from "@/components/smooth-scroll";

type Options = {
	enabled?: boolean;
};

export function useMagneticList(
	rootRef: RefObject<HTMLElement | null>,
	headRef: RefObject<HTMLElement | null>,
	options?: Options,
) {
	useEffect(() => {
		if (options?.enabled === false) return;

		const root = rootRef.current;
		const head = headRef.current;
		if (!root || !head) return;

		const isMobile = () => window.innerWidth <= 767;

		const updateProximity = () => {
			if (isMobile() || getComputedStyle(head).display === "none") return;

			const idHead = head.querySelector<HTMLElement>('[data-item="1"]');
			const titleHead = head.querySelector<HTMLElement>('[data-item="2"]');
			if (!idHead || !titleHead) return;

			const idHeadTop = idHead.getBoundingClientRect().top;
			const titleHeadTop = titleHead.getBoundingClientRect().top;
			const threshold = 100;

			const idElements = root.querySelectorAll<HTMLElement>(".studies-lists__contents-ul .id");
			idElements.forEach((el) => {
				const dist = Math.abs(el.getBoundingClientRect().top - idHeadTop);
				const progress = Math.max(0, 1 - dist / threshold);
				el.style.paddingLeft = `${30 + progress * 60}rem`;
			});

			const titleElements = root.querySelectorAll<HTMLElement>(
				".studies-lists__contents-ul .title",
			);
			titleElements.forEach((el) => {
				const dist = Math.abs(el.getBoundingClientRect().top - titleHeadTop);
				const progress = Math.max(0, 1 - dist / threshold);
				el.style.paddingLeft = `${progress * 60}rem`;
			});
		};

		updateProximity();

		let lenis = getLenis();
		if (lenis) {
			lenis.on("scroll", updateProximity);
		} else {
			requestAnimationFrame(() => {
				lenis = getLenis();
				lenis?.on("scroll", updateProximity);
			});
		}

		window.addEventListener("scroll", updateProximity, { passive: true });
		window.addEventListener("resize", updateProximity, { passive: true });

		return () => {
			lenis?.off("scroll", updateProximity);
			window.removeEventListener("scroll", updateProximity);
			window.removeEventListener("resize", updateProximity);

			const idElements = root.querySelectorAll<HTMLElement>(".studies-lists__contents-ul .id");
			idElements.forEach((el) => {
				el.style.paddingLeft = "";
			});
			const titleElements = root.querySelectorAll<HTMLElement>(
				".studies-lists__contents-ul .title",
			);
			titleElements.forEach((el) => {
				el.style.paddingLeft = "";
			});
		};
	}, [rootRef, headRef, options?.enabled]);
}
