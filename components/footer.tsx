import Link from "next/link";
import type { JSX } from "react";
import type { SocialMediaLink } from "@/utils/types";

type Props = {
	socialMediaLinks: SocialMediaLink[];
	location: string;
};

const Footer = ({ location, socialMediaLinks }: Props): JSX.Element => {
	const instagramLink = socialMediaLinks.find((socialLink) =>
		/instagram/i.test(socialLink.source),
	);

	return (
		<footer className="grid grid-cols-[auto_1fr_auto] justify-center gap-2 px-[2.5rem] py-6 text-[0.8rem] max-sm:grid-cols-1 max-sm:grid-rows-[auto_auto_auto] max-sm:gap-4 [&_a]:underline">
			<div className="flex flex-col items-start max-sm:items-center">
				<span>{location}</span>
				<span>
					Copyright &copy;{new Date().getFullYear()} Sarabeth Bel&oacute;n
				</span>
			</div>
			<div className="flex flex-1 justify-center max-sm:row-[1]">
				{instagramLink && (
					<Link
						key="footer-link-instagram"
						className="group flex h-8 w-8 items-center justify-center rounded-full bg-foreground no-underline transition-all duration-500 ease-in-out hover:bg-accent hover:duration-150"
						href={instagramLink.link}
						aria-label="Link to Sarabeth's Instgram"
					>
						<svg
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="size-5 fill-background-light transition-colors duration-150 group-hover:stroke-accent"
						>
							<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
							<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
							<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
						</svg>
					</Link>
				)}
			</div>
			<div className="flex flex-col items-end max-sm:items-center">
				<span>
					Designed by <a href="https://carolyndiloreto.com">Carolyn DiLoreto</a>
				</span>
				<span>
					Developed by <a href="https://pauldiloreto.com">Paul DiLoreto</a>
				</span>
			</div>
		</footer>
	);
};

export default Footer;
