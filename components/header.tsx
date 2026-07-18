import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { type JSX, lazy, Suspense, useState } from "react";
import SvgLogo from "@/components/icons/logo";
import type { NavigationLink } from "@/components/mobile-navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const loadMobileNavigation = () => import("@/components/mobile-navigation");
const MobileNavigation = lazy(loadMobileNavigation);

type HeaderProps = {
	brandName: string;
};

const links = [
	{ label: "About", url: "/about" },
	{ label: "Engagements", url: "/engagements" },
	{ label: "Media", url: "/media" },
	{ label: "Lessons", url: "/lessons" },
	{ label: "Contact", url: "/contact" },
] satisfies readonly NavigationLink[];

const Header = ({ brandName }: HeaderProps): JSX.Element => {
	const route = useRouterState({
		select: (state) => state.location.pathname,
	});
	const [mobileNavLoaded, setMobileNavLoaded] = useState(false);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const preloadMobileNavigation = (): void => {
		void loadMobileNavigation();
	};
	const openMobileNavigation = (): void => {
		setMobileNavLoaded(true);
		setMobileNavOpen(true);
	};
	const menuButton = (
		<Button
			variant="unstyled"
			size="unstyled"
			className="hidden cursor-pointer rounded-none bg-background-light p-2 hover:bg-background-light max-md:inline-flex"
			aria-label="Open Navigation"
			aria-expanded={mobileNavOpen}
			onClick={openMobileNavigation}
			onFocus={preloadMobileNavigation}
			onPointerEnter={preloadMobileNavigation}
		>
			<Menu className="size-5 text-foreground" />
		</Button>
	);

	return (
		<header className="sticky top-0 z-40 flex w-full items-center justify-between bg-background px-[2.5rem] py-2 max-xs:px-4">
			<Link to="/" className="flex items-center">
				<span className="mr-4 font-serif text-[2rem] font-bold max-xs:text-[1.5rem]">
					{brandName}
				</span>
				<SvgLogo className="w-24 fill-accent max-xs:w-16" />
			</Link>

			<nav className="grid grid-cols-[repeat(5,auto)] gap-8 max-md:hidden">
				{links.map((link) => (
					<Link key={`nav-${link.url}`} to={link.url}>
						<span
							className={cn(
								"relative inline-block text-base font-bold uppercase transition-all duration-100 ease-in-out",
								"hover:translate-x-[0.2rem] hover:before:absolute hover:before:bottom-[-0.2rem] hover:before:left-[-0.5rem] hover:before:-z-1 hover:before:h-[80%] hover:before:w-full hover:before:bg-background-light hover:before:-translate-x-[0.2rem]",
								link.url === route &&
									"before:absolute before:bottom-[-0.2rem] before:left-[-0.5rem] before:-z-1 before:h-[80%] before:w-full before:bg-background-light",
							)}
						>
							{link.label}
						</span>
					</Link>
				))}
			</nav>

			{mobileNavLoaded ? (
				<Suspense fallback={menuButton}>
					<MobileNavigation
						links={links}
						onOpenChange={setMobileNavOpen}
						open={mobileNavOpen}
						route={route}
					/>
				</Suspense>
			) : (
				menuButton
			)}
		</header>
	);
};

export default Header;
