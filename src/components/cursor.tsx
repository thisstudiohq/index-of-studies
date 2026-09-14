import { useEffect, useRef } from "react";

import gsap from "gsap";

export function Cursor() {
	const dotRef = useRef<HTMLDivElement>(null);
	const ringRef = useRef<HTMLDivElement>(null);
	const labelRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const isMobile = window.innerWidth < 768;
		const isTouch = window.matchMedia("(pointer: coarse)").matches;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (isMobile || isTouch || reduced) return;

		const dot = dotRef.current;
		const ring = ringRef.current;
		const label = labelRef.current;
		if (!dot || !ring) return;

		dot.style.mixBlendMode = "normal";
		ring.style.mixBlendMode = "normal";

		document.documentElement.classList.add("has-custom-cursor");

		let mx = window.innerWidth / 2;
		let my = window.innerHeight / 2;
		let dx = mx;
		let dy = my;

		const xToDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
		const yToDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
		const xToRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
		const yToRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

		let raf = 0;
		const tick = () => {
			const el = document.elementFromPoint(mx, my) as HTMLElement | null;
			const magnet = el?.closest<HTMLElement>("[data-magnetic]");
			if (magnet) {
				const r = magnet.getBoundingClientRect();
				const cx = r.left + r.width / 2;
				const cy = r.top + r.height / 2;
				dx = mx + (cx - mx) * 0.25;
				dy = my + (cy - my) * 0.25;
			} else {
				dx = mx;
				dy = my;
			}
			xToDot(dx);
			yToDot(dy);
			xToRing(dx);
			yToRing(dy);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		const onMove = (e: MouseEvent) => {
			mx = e.clientX;
			my = e.clientY;
		};

		const setHover = (kind: "default" | "link" | "image" | "text") => {
			const primaryColor =
				getComputedStyle(document.documentElement)
					.getPropertyValue("--color-text-primary")
					.trim() || "#1500E1";

			const cfg = {
				default: { scale: 1, bg: "transparent", border: 1, text: "" },
				link: { scale: 1.6, bg: "transparent", border: 1, text: "" },
				image: { scale: 3.2, bg: primaryColor, border: 0, text: "VIEW" },
				text: { scale: 2.4, bg: "transparent", border: 1, text: "" },
			}[kind];
			gsap.to(ring, {
				scale: cfg.scale,
				backgroundColor: cfg.bg,
				borderWidth: cfg.border,
				borderColor: primaryColor,
				duration: 0.35,
				ease: "power3.out",
			});
			ring.style.mixBlendMode = "normal";
			if (label) {
				label.textContent = cfg.text;
				gsap.to(label, { opacity: cfg.text ? 1 : 0, duration: 0.2 });
			}
		};

		const onOver = (e: MouseEvent) => {
			const t = e.target as HTMLElement;
			if (!t) return;
			if (t.closest("[data-cursor='image'], img, video, picture")) return setHover("image");
			if (t.closest("a, button, [role='button'], [data-cursor='link']")) return setHover("link");
			if (t.closest("input, textarea, [contenteditable], [data-cursor='text']"))
				return setHover("text");
			setHover("default");
		};

		const onDown = () => gsap.to(ring, { scale: 0.7, duration: 0.18, ease: "power2.out" });
		const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25, ease: "power2.out" });
		const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
		const onEnter = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseover", onOver);
		window.addEventListener("mousedown", onDown);
		window.addEventListener("mouseup", onUp);
		document.addEventListener("mouseleave", onLeave);
		document.addEventListener("mouseenter", onEnter);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseover", onOver);
			window.removeEventListener("mousedown", onDown);
			window.removeEventListener("mouseup", onUp);
			document.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("mouseenter", onEnter);
			document.documentElement.classList.remove("has-custom-cursor");
		};
	}, []);

	return (
		<>
			<div
				ref={ringRef}
				aria-hidden
				className="cursor-ring pointer-events-none fixed top-0 left-0 z-9998 flex items-center justify-center"
				style={{
					width: 36,
					height: 36,
					marginLeft: -18,
					marginTop: -18,
					borderRadius: "9999px",
					border: "1px solid var(--color-text-primary, #1500E1)",
					borderColor: "var(--color-text-primary, #1500E1)",
					color: "var(--color-text-primary, #1500E1)",
					mixBlendMode: "normal",
					willChange: "transform",
				}}
			>
				<span
					ref={labelRef}
					className="label font-mono font-bold"
					style={{ fontSize: 9, opacity: 0, color: "var(--color-bg-primary, #FFFFFF)" }}
				/>
			</div>
			<div
				ref={dotRef}
				aria-hidden
				className="cursor-dot pointer-events-none fixed top-0 left-0 z-9999"
				style={{
					width: 4,
					height: 4,
					marginLeft: -2,
					marginTop: -2,
					borderRadius: "9999px",
					background: "var(--color-text-primary, #1500E1)",
					mixBlendMode: "normal",
					willChange: "transform",
				}}
			/>
		</>
	);
}
