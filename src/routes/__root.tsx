import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import scssCss from "../scss/index.scss?url";
import appCss from "../styles.css?url";
import "../scss/index.scss";

import { Cursor } from "@/components/cursor";
import { siteConfig } from "@/lib/site-config";
import { IntroProvider } from "@/lib/intro-context";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: `${siteConfig.name} — ${siteConfig.author}` },
			{ name: "description", content: siteConfig.tagline },
			{ name: "author", content: siteConfig.author },
			{ name: "theme-color", content: siteConfig.themeColor },

			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: siteConfig.name },
			{ property: "og:title", content: `${siteConfig.name} — ${siteConfig.author}` },
			{ property: "og:description", content: siteConfig.tagline },
			{ property: "og:url", content: siteConfig.url },
			{ property: "og:locale", content: siteConfig.locale },
			{ property: "og:image", content: `${siteConfig.url}/opengraph-image.png` },

			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: `${siteConfig.name} — ${siteConfig.author}` },
			{ name: "twitter:description", content: siteConfig.tagline },
			{ name: "twitter:image", content: `${siteConfig.url}/opengraph-image.png` },
		],
		links: [
			{ rel: "canonical", href: siteConfig.url },
			{
				rel: "preload",
				href: "/shared/fonts/ppneuemontreal-book.otf",
				as: "font",
				type: "font/otf",
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				href: "/shared/fonts/ppneuemontreal-medium.otf",
				as: "font",
				type: "font/otf",
				crossOrigin: "anonymous",
			},
			{
				rel: "preload",
				href: "/shared/fonts/SFMonoRegular.otf",
				as: "font",
				type: "font/otf",
				crossOrigin: "anonymous",
			},
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
			{ rel: "stylesheet", href: appCss },
			{ rel: "stylesheet", href: scssCss },
		],
	}),
	notFoundComponent: function RootNotFound() {
		return (
			<main style={{ padding: "120px 20px", textAlign: "center" }}>
				<p
					style={{
						fontSize: "14px",
						textTransform: "uppercase",
						letterSpacing: "0.08em",
						marginBottom: "16px",
					}}
				>
					Page Not Found
				</p>
				<a
					href="/"
					className="link link--metis"
					style={{ fontSize: "12px", textTransform: "uppercase" }}
				>
					Back to Studies
				</a>
			</main>
		);
	},
	shellComponent: RootDocument,
});

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			name: siteConfig.name,
			url: siteConfig.url,
			description: siteConfig.tagline,
			author: {
				"@type": "Person",
				name: siteConfig.author,
				url: siteConfig.authorUrl,
			},
		},
		{
			"@type": "CollectionPage",
			name: siteConfig.name,
			url: siteConfig.url,
			description: siteConfig.tagline,
			isPartOf: { "@type": "WebSite", url: siteConfig.url },
		},
	],
};

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from static site config
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body suppressHydrationWarning>
				<IntroProvider>
					<SmoothScroll>
						<SiteHeader />
						{children}
						<Cursor />
					</SmoothScroll>
				</IntroProvider>
				<Scripts />
			</body>
		</html>
	);
}
