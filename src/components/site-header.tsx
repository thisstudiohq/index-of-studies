import { useRouterState } from "@tanstack/react-router";
import { type MouseEvent, useContext } from "react";

import { TransitionContext } from "@/lib/transition";
import { Arrow } from "./ui/arrow";

export function SiteHeader() {
	const { to } = useContext(TransitionContext);
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	const go = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		to(href);
	};

	return (
		<header className="nav">
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
					href="https://ibrahimraimi.xyz"
					rel="noopener"
				>
					About <Arrow />
				</a>
			</div>
		</header>
	);
}
