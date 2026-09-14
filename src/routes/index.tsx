import { total } from "@/lib/studies";
import { Scene } from "@/components/scene";
import { siteConfig } from "@/lib/site-config";
import { SiteHero } from "@/components/site-hero";
import { SiteFooter } from "@/components/site-footer";
import { StudiesList } from "@/components/studies-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{
				title: `${siteConfig.name} — Creative Experiments by ${siteConfig.author}`,
			},
			{
				name: "description",
				content: `${total} experimental studies exploring motion, interaction, and visual systems. WebGL, JavaScript, and creative coding by ${siteConfig.author}.`,
			},
			{
				property: "og:title",
				content: `${siteConfig.name} — Creative Experiments by ${siteConfig.author}`,
			},
			{
				property: "og:description",
				content: `${total} experimental studies exploring motion, interaction, and visual systems.`,
			},
			{ property: "og:url", content: siteConfig.url },
		],
		links: [{ rel: "canonical", href: siteConfig.url }],
	}),
	component: Home,
});

function Home() {
	return (
		<main>
			<Scene />
			<SiteHero />
			<StudiesList />
			<SiteFooter />
		</main>
	);
}
