import type { ReactNode } from "react";

interface SiteFooterProps {
	copy?: ReactNode;
	linkText?: string;
	linkHref?: string;
	credit?: string;
	isExternal?: boolean;
}

export function SiteFooter({
	copy = "Built as a space to explore ideas, test interactions, and refine my approach to creative development.",
	linkText = "Get in touch",
	linkHref = "mailto:ibrahimraimi.tech@gmail.com",
	credit = "© This Studio",
	isExternal = false,
}: SiteFooterProps = {}) {
	return (
		<footer className="footer studies-block">
			<p className="footer__copy">{copy}</p>
			<p className="footer__action">
				<a
					className="footer__link"
					href={linkHref}
					target={isExternal ? "_blank" : undefined}
					rel={isExternal ? "noopener noreferrer" : undefined}
					data-hover="line"
				>
					<span className="footer__link-text" data-target="line">
						{linkText}
					</span>
					<span className="footer__arrow arrow" aria-hidden="true">
						→
					</span>
				</a>
			</p>
			<p className="footer__credit">
				<small>{credit}</small>
			</p>
		</footer>
	);
}
