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
			const mobile = isMobile();
			let idHeadTop = 0;
			let titleHeadTop = 0;

			if (!mobile && getComputedStyle(head).display !== "none") {
				const idHead = head.querySelector<HTMLElement>('[data-item="1"]');
				const titleHead = head.querySelector<HTMLElement>('[data-item="2"]');
				if (idHead && titleHead) {
					idHeadTop = idHead.getBoundingClientRect().top;
					titleHeadTop = titleHead.getBoundingClientRect().top;
				} else {
					idHeadTop = 200;
					titleHeadTop = 200;
				}
			} else {
				idHeadTop = window.innerHeight * 0.35;
				titleHeadTop = window.innerHeight * 0.35;
			}

			const threshold = mobile ? 75 : 100;
			const idBasePadding = mobile ? 0 : 30;
			const maxShift = mobile ? 26 : 60;

			const idElements = root.querySelectorAll<HTMLElement>(".studies-lists__contents-ul .id");
			idElements.forEach((el) => {
				const dist = Math.abs(el.getBoundingClientRect().top - idHeadTop);
				const progress = Math.max(0, 1 - dist / threshold);
				el.style.paddingLeft = `${idBasePadding + progress * maxShift}rem`;
			});

			const titleElements = root.querySelectorAll<HTMLElement>(
				".studies-lists__contents-ul .title",
			);
			titleElements.forEach((el) => {
				const dist = Math.abs(el.getBoundingClientRect().top - titleHeadTop);
				const progress = Math.max(0, 1 - dist / threshold);
				el.style.paddingLeft = `${progress * maxShift}rem`;
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
