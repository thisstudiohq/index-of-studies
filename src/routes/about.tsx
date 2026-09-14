import { createFileRoute } from "@tanstack/react-router";
import { siteConfig } from "@/lib/site-config";

const ABOUT_DESCRIPTION =
	"The works featured here are personal projects. For other client projects, please get in touch. I handle everything from design to implementation, and partial involvement is also possible.";

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: `About — ${siteConfig.name}` },
			{ name: "description", content: ABOUT_DESCRIPTION },
			{ property: "og:title", content: `About — ${siteConfig.name}` },
			{ property: "og:description", content: ABOUT_DESCRIPTION },
			{ property: "og:url", content: `${siteConfig.url}/about` },
		],
		links: [{ rel: "canonical", href: `${siteConfig.url}/about` }],
	}),
	component: About,
});

function About() {
	return (
		<main className="about">
			<div className="about__center">
				<p className="about__statement">{ABOUT_DESCRIPTION}</p>

				<a className="footer__link" href={`mailto:${siteConfig.email}`}>
					Get in touch
					<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
						<path
							d="M2 8 L8 2 M3.2 2 H8 V6.8"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.2"
						/>
					</svg>
				</a>
				<p className="footer__credit">© {siteConfig.name}</p>
			</div>
		</main>
	);
}
