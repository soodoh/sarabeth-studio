import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { type JSX, type ReactNode, useEffect, useRef } from "react";
import ArrowButton, {
	type InternalArrowButtonPath,
} from "@/components/arrow-button";
import SvgLogo from "@/components/icons/logo";
import StyledImage from "@/components/styled-image";
import WidthContainer from "@/components/width-container";
import { cn } from "@/lib/utils";
import type { HomeData } from "@/utils/types";

const isTeachingSection = (name: string): boolean => {
	return /sarabeth'?s\s*studio/gi.test(name);
};

const makeRelativeUrl = (url: string): string => {
	return url.replace(/^https?:\/\/(.+\.)?sarabethbelon\.com/, "");
};

const getInternalPath = (url: string): InternalArrowButtonPath | undefined => {
	switch (url) {
		case "/about":
		case "/contact":
		case "/engagements":
			return url;
		default:
			return undefined;
	}
};

const Reveal = ({
	children,
	className,
	duration,
	visible,
}: {
	children: ReactNode;
	className?: string;
	duration: "one-second" | "two-seconds";
	visible: boolean;
}): JSX.Element => {
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element || visible) return;
		if (!("IntersectionObserver" in window)) {
			element.dataset.visible = "true";
			return;
		}

		const observer = new IntersectionObserver((entries) => {
			if (!entries.some((entry) => entry.isIntersecting)) return;
			element.dataset.visible = "true";
			observer.disconnect();
		});
		observer.observe(element);
		return () => observer.disconnect();
	}, [visible]);

	return (
		<div
			ref={elementRef}
			data-slot="home-reveal"
			data-visible={visible ? "true" : undefined}
			onFocusCapture={(event) => {
				event.currentTarget.dataset.visible = "true";
				event.currentTarget.dataset.focusRevealed = "true";
			}}
			className={cn(
				"transition-opacity ease-out motion-reduce:opacity-100 motion-reduce:transition-none",
				duration === "one-second" ? "duration-[1000ms]" : "duration-[2000ms]",
				className,
			)}
		>
			{children}
		</div>
	);
};

const HomeContent = ({ homeData }: { homeData: HomeData[] }): JSX.Element => {
	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove("js-pending");
		root.classList.add("js");
		return () => root.classList.remove("js");
	}, []);

	return (
		<WidthContainer>
			{homeData.map((homeRow, rowIndex) => {
				const isTeaching = isTeachingSection(homeRow.title);
				const isReversed = rowIndex % 2 === 1;
				const isInitiallyVisible = rowIndex === 0;
				const buttonUrl = homeRow.buttonLink
					? makeRelativeUrl(homeRow.buttonLink)
					: undefined;
				const internalButtonUrl = buttonUrl
					? getInternalPath(buttonUrl)
					: undefined;

				return (
					<div
						key={homeRow.id}
						className={cn(
							"mb-24 flex",
							isReversed && "flex-row-reverse",
							"max-sm:flex-col",
						)}
					>
						<div
							className={cn(
								homeRow.mainSection
									? "w-[calc(60%_-_2rem_+_0.5px)] shrink-0"
									: "grow",
								isTeaching && "mt-24",
								"max-sm:w-full",
							)}
						>
							{homeRow.images.map((image, imageIndex) => {
								const isMultiple = homeRow.images.length > 1;
								const isPortrait = image.width < image.height;
								const isLandscape = image.width >= image.height;
								const sizes = homeRow.mainSection
									? "(max-width: 699px) calc(100vw - 5rem), (max-width: 1199px) calc(60vw - 5rem), 640px"
									: isMultiple && isPortrait
										? "(max-width: 699px) 60vw, (max-width: 1199px) 36vw, 403px"
										: "(max-width: 699px) calc(100vw - 5rem), (max-width: 1199px) 60vw, 672px";

								return (
									<Reveal
										key={image.id}
										duration="one-second"
										visible={isInitiallyVisible}
										className={cn(
											isMultiple &&
												isPortrait &&
												"relative z-2 mx-auto w-[60%] [&:not(:first-child)]:mt-[-10%] [&:not(:first-child)]:ml-[30%]",
											isMultiple &&
												isLandscape &&
												"relative z-0 [&:not(:first-child)]:mt-[-40%] [&:not(:first-child)]:mr-[40%] [&:not(:first-child)]:-ml-[40%] max-sm:[&:not(:first-child)]:mt-[-4%] max-sm:[&:not(:first-child)]:ml-0 max-sm:[&:not(:first-child)]:mr-0",
										)}
									>
										<StyledImage
											priority={rowIndex === 0 && imageIndex === 0}
											sizes={sizes}
											overlayDirection={
												image.width > image.height ? "left" : "right"
											}
											image={image}
										/>
									</Reveal>
								);
							})}
						</div>
						<Reveal
							duration="two-seconds"
							visible={isInitiallyVisible}
							className={cn(
								homeRow.mainSection
									? "ml-16 flex w-[calc(40%_-_2rem_-_0.5px)] shrink-0 items-center font-serif text-[2rem]"
									: cn("min-w-[30%]", isReversed ? "mr-16" : "ml-16"),
								isTeaching && "w-[40%]",
								"max-sm:ml-0 max-sm:mr-0 max-sm:mt-20 max-sm:w-full",
							)}
						>
							{isTeaching && <SvgLogo className="ml-12 w-60 fill-accent" />}
							{!homeRow.mainSection && (
								<>
									<h1 className="m-0 font-serif text-[3rem]">
										{homeRow.title}
									</h1>
									<h2 className="font-sans text-[1.2rem] uppercase">
										{homeRow.subtitle}
									</h2>
									<div className="h-[0.15rem] w-6 bg-foreground" />
								</>
							)}
							<div>{documentToReactComponents(homeRow.description)}</div>
							{internalButtonUrl ? (
								<ArrowButton
									internal
									label={homeRow.buttonText}
									url={internalButtonUrl}
								/>
							) : buttonUrl ? (
								<ArrowButton label={homeRow.buttonText} url={buttonUrl} />
							) : null}
						</Reveal>
					</div>
				);
			})}
		</WidthContainer>
	);
};

export default HomeContent;
