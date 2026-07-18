import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import type { JSX } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type NavigationLink = {
	label: string;
	url: "/about" | "/engagements" | "/media" | "/lessons" | "/contact";
};

type MobileNavigationProps = {
	links: readonly NavigationLink[];
	onOpenChange: (open: boolean) => void;
	open: boolean;
	route: string;
};

const MobileNavigation = ({
	links,
	onOpenChange,
	open,
	route,
}: MobileNavigationProps): JSX.Element => (
	<Sheet open={open} onOpenChange={onOpenChange}>
		<SheetTrigger asChild>
			<Button
				variant="unstyled"
				size="unstyled"
				className="hidden cursor-pointer rounded-none bg-background-light p-2 hover:bg-background-light max-md:inline-flex"
				aria-label="Open Navigation"
			>
				<Menu className="size-5 text-foreground" />
			</Button>
		</SheetTrigger>
		<SheetContent side="right" className="flex items-center justify-center">
			<SheetTitle className="sr-only">Navigation</SheetTitle>
			<nav className="flex flex-col items-center gap-8">
				{links.map((link) => (
					<SheetClose asChild key={`mobile-nav-${link.url}`}>
						<Link to={link.url} className="w-full text-center">
							<span
								className={cn(
									"relative inline-block text-base font-bold uppercase transition-all duration-100 ease-in-out",
									link.url === route &&
										"before:absolute before:bottom-[-0.2rem] before:left-[-0.5rem] before:-z-1 before:h-[80%] before:w-full before:bg-background-light",
								)}
							>
								{link.label}
							</span>
						</Link>
					</SheetClose>
				))}
			</nav>
		</SheetContent>
	</Sheet>
);

export default MobileNavigation;
