import { useEffect, type ReactNode } from "react";

import gsap from "gsap";
import Lenis from "lenis";
import "lenis/dist/lenis.css"

let lenis: Lenis | null = null;

export function getLenis() {
    return lenis
}

export function SmoothScroll({ children }: { children: ReactNode }) {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        lenis = new Lenis({
            duration: 1.15,
            smoothWheel: true
        });

        const onTick = (time: number) => {
            lenis?.raf(time * 1000);
        }

        gsap.ticker.add(onTick);
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove(onTick);
            lenis?.destroy();
            lenis = null;
        };
    }, [])

    return children
}