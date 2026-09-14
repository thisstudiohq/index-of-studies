import { useRouterState } from "@tanstack/react-router";
import gsap from "gsap";
import { type MouseEvent, useContext, useEffect, useRef } from "react";

import { useIntro } from "@/lib/intro-context";
import { TransitionContext } from "@/lib/transition";
import { Arrow } from "./ui/arrow";

export function SiteHeader() {
	const { to } = useContext(TransitionContext);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { isLoaded } = useIntro();
	const headerRef = useRef<HTMLElement>(null);
	const hasAnimatedInRef = useRef(false);

	const go = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		to(href);
	};

	useEffect(() => {
		if (!isLoaded || hasAnimatedInRef.current) return;
		const headerElement = headerRef.current;
		if (!headerElement) return;

		hasAnimatedInRef.current = true;

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			gsap.set(headerElement, { clearProps: "all" });
			return;
		}

		gsap.fromTo(
			headerElement,
			{ y: -18, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				duration: 0.9,
				ease: "power3.out",
				delay: 0.15,
				clearProps: "transform,opacity",
			},
		);
	}, [isLoaded]);

	return (
		<header className="nav" ref={headerRef}>
			<nav className="nav__left" aria-label="Main navigation">
				<a
					href="/"
					className="nav__link link link--metis"
					aria-current={pathname === "/" ? "page" : undefined}
					onClick={go("/")}
				>
					Studies
				</a>
				<a
					href="/snapshot"
					className="nav__link link link--metis"
					aria-current={pathname.startsWith("/snapshot") ? "page" : undefined}
					onClick={go("/snapshot")}
				>
					Snapshot
				</a>
			</nav>
			<div className="nav__center">
				{/* <a
				href="/about"
				className="nav__link link link--metis"
				aria-current={pathname.startsWith("/about") ? "page" : undefined}
				onClick={go("/about")}
			>
				About <Arrow />
			</a> */}
			</div>
			<div className="nav__right">
				<a
					className="nav__link link link--metis"
					target="_blank"
					href="https://ibrahimraimi.xyz/about"
					rel="noopener"
				>
					About <Arrow />
				</a>
			</div>
		</header>
	);
}
