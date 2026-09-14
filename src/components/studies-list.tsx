import { useRef } from "react";
import { useMagneticList } from "@/hooks/use-magnetic-list";
import { groupByYear } from "@/lib/studies";

export function StudiesList() {
	const rootRef = useRef<HTMLElement>(null);
	const headRef = useRef<HTMLDivElement>(null);
	const groups = groupByYear();

	useMagneticList(rootRef, headRef, { enabled: true });

	return (
		<section className="studies-lists" ref={rootRef}>
			<div className="studies-lists__head" ref={headRef}>
				<p data-item="1">
					<span className="studies-lists__head-text">id</span>
				</p>
				<p data-item="2">
					<span className="studies-lists__head-text">title</span>
				</p>
				<p data-item="3">
					<span className="studies-lists__head-text">field</span>
				</p>
			</div>
			<div className="studies-lists__contents">
				{groups.map(([year, items]) => (
					<ul className="studies-lists__contents-ul" key={year}>
						<li className="year">
							<span className="word">
								{year} ({items.length})
							</span>
						</li>
						<li className="contents studies-lists__items">
							{items.map((study) => {
								const hasUrl = Boolean(study.url);
								return (
									<a
										key={study.id}
										className="list-link"
										href={hasUrl ? study.url : undefined}
										target={hasUrl ? "_blank" : undefined}
										rel={hasUrl ? "noopener noreferrer" : undefined}
										aria-disabled={!hasUrl}
										onClick={
											hasUrl
												? undefined
												: (event) => {
														event.preventDefault();
													}
										}
									>
										<p className="id">
											<span className="word">{study.id}</span>
										</p>
										<p className="title">
											<span className="word">
												<span className="title-inner">{study.title}</span>
											</span>
										</p>
										<p className="field">
											<span className="word">{study.field}</span>
										</p>
										<span className="line" />
									</a>
								);
							})}
						</li>
					</ul>
				))}
			</div>
		</section>
	);
}
