import { Link } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";
import SvgArrow from "@/components/icons/arrow";

export type InternalArrowButtonPath = "/about" | "/contact" | "/engagements";

type Props =
	| {
			internal: true;
			label?: string;
			url: InternalArrowButtonPath;
	  }
	| {
			internal?: false;
			label?: string;
			url: string;
	  };

const className =
	"group flex items-center transition-all duration-200 ease-in-out hover:translate-x-[0.2rem] hover:-translate-y-[0.2rem]";

const ButtonContent = ({ label }: { label?: string }): ReactNode => (
	<>
		<div className="relative z-1 inline-block font-bold uppercase before:absolute before:bottom-[-0.2rem] before:left-[-0.5rem] before:-z-1 before:h-[80%] before:w-full before:bg-background-light before:transition-all before:duration-200 before:ease-in-out group-hover:before:h-[50%] group-hover:before:w-[80%] group-hover:before:-translate-x-[0.2rem] group-hover:before:translate-y-[0.2rem]">
			{label ?? "Click Here"}
		</div>
		<SvgArrow className="ml-4 inline-block fill-foreground" />
	</>
);

const ArrowButton = (props: Props): JSX.Element => {
	if (props.internal) {
		return (
			<Link className={className} to={props.url}>
				<ButtonContent label={props.label} />
			</Link>
		);
	}

	return (
		<a className={className} href={props.url}>
			<ButtonContent label={props.label} />
		</a>
	);
};

export default ArrowButton;
