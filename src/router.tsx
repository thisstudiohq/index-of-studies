import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultNotFoundComponent: () => (
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
		),
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
