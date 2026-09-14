import { useEffect, useRef } from "react";

import gsap from "gsap";

import { total } from "@/lib/studies";
import { useIntro } from "@/lib/intro-context";

export function SiteHero() {
	const ref = useRef<HTMLElement>(null);
	const { isLoaded } = useIntro();
	const hasAnimatedInRef = useRef(false);

	useEffect(() => {
		const root = ref.current;
		if (!root) return;

		const words = root.querySelectorAll(".hero__word");
		const desc = root.querySelector(".hero__desc");

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			gsap.set([words, desc], { clearProps: "all" });
			return;
		}

		if (!isLoaded || hasAnimatedInRef.current) return;
		hasAnimatedInRef.current = true;

		gsap.fromTo(
			words,
			{ yPercent: 110 },
			{
				yPercent: 0,
				duration: 1.15,
				ease: "power4.out",
				stagger: 0.08,
				delay: 0.2,
				clearProps: "transform",
			},
		);
		gsap.fromTo(
			desc,
			{ y: 16, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.95, delay: 0.5, ease: "power3.out" },
		);
	}, [isLoaded]);

	return (
		<section className="hero" ref={ref}>
			<div className="hero__contents">
				<h1 className="hero__title">
					<span className="hero__cell hero__index">
						<span className="hero__word">Index</span>
					</span>
					<span className="hero__cell hero__of">
						<span className="hero__word">Of</span>
					</span>
					<span className="hero__cell hero__studies">
						<span className="hero__word">Studies</span>
					</span>
					<span className="hero__cell hero__count">
						<span className="hero__word">({total})</span>
					</span>
				</h1>
				<div className="hero__read">
					<p className="hero__desc">
						A collection of ideas and experimental works exploring motion, interaction, and visual
						systems. These studies represent the thinking and direction behind my creative practice.
					</p>
				</div>
			</div>
		</section>
	);
}
