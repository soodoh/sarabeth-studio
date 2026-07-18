import { Link } from "@tanstack/react-router";
import { type JSX, type KeyboardEvent, useRef, useState } from "react";
import SvgLogo from "@/components/icons/logo";
import LessonsPageSections from "@/components/lessons-page-sections";
import { Button } from "@/components/ui/button";
import WidthContainer from "@/components/width-container";
import { brandButtonClasses, cn } from "@/lib/utils";
import type { LessonsData } from "@/utils/types";
import { LessonsPages } from "@/utils/types";

const lessonPages = Object.values(LessonsPages);
const tabId = (page: LessonsPages): string =>
	`lessons-tab-${page.toLowerCase().replaceAll(" ", "-")}`;

const LessonsPageContent = ({
	lessonsData,
}: {
	lessonsData: LessonsData;
}): JSX.Element => {
	const { email, phoneNumber, reviewLink } = lessonsData;
	const [section, setSection] = useState(LessonsPages.About);
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

	const handleTabKeyDown = (
		event: KeyboardEvent<HTMLButtonElement>,
		index: number,
	): void => {
		let nextIndex: number | undefined;
		switch (event.key) {
			case "ArrowLeft":
				nextIndex = (index - 1 + lessonPages.length) % lessonPages.length;
				break;
			case "ArrowRight":
				nextIndex = (index + 1) % lessonPages.length;
				break;
			case "Home":
				nextIndex = 0;
				break;
			case "End":
				nextIndex = lessonPages.length - 1;
				break;
			default:
				return;
		}

		event.preventDefault();
		setSection(lessonPages[nextIndex]);
		tabRefs.current[nextIndex]?.focus();
	};

	return (
		<>
			<div
				className="flex justify-center bg-background-light max-sm:flex-col"
				role="tablist"
				aria-label="Lesson information"
			>
				{lessonPages.map((page, index) => (
					<Button
						variant="unstyled"
						size="unstyled"
						ref={(element) => {
							tabRefs.current[index] = element;
						}}
						role="tab"
						id={tabId(page)}
						aria-controls="lessons-panel"
						aria-selected={section === page}
						tabIndex={section === page ? 0 : -1}
						onClick={() => setSection(page)}
						onKeyDown={(event) => handleTabKeyDown(event, index)}
						className={cn(
							"cursor-pointer rounded-none border-none bg-transparent px-4 py-6 font-sans text-base font-bold uppercase",
							section === page
								? "bg-accent-dark text-background-light hover:bg-accent-dark hover:text-background-light"
								: "text-foreground hover:bg-transparent hover:text-accent",
						)}
						key={page}
					>
						{page}
					</Button>
				))}
			</div>
			<WidthContainer className="flex flex-col">
				<div
					id="lessons-panel"
					role="tabpanel"
					aria-labelledby={tabId(section)}
					className="my-12"
				>
					<LessonsPageSections section={section} lessonsData={lessonsData} />
				</div>
				<div className="flex flex-col items-center [&>h1]:m-0 [&>h1]:text-[2rem]">
					<SvgLogo className="w-40 fill-accent" />
					<h1>Contact</h1>
					<div className="my-4 flex flex-col items-center [&_a]:my-2">
						<a href={`mailto:${email}`}>{email}</a>
						<a href={`tel:${phoneNumber.replaceAll(/\D+/g, "")}`}>
							{phoneNumber}
						</a>
					</div>
					<Link to="/contact" className={cn(brandButtonClasses, "my-2")}>
						Book a Lesson
					</Link>
					<a href={reviewLink} className={cn(brandButtonClasses, "my-2")}>
						View Reviews
					</a>
				</div>
			</WidthContainer>
		</>
	);
};

export default LessonsPageContent;
