"use client";

import SvgLogo from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type HeaderProps = {
  brandName: string;
};

const Header = ({ brandName }: HeaderProps) => {
  const route = usePathname();
  const links = [
    { label: "About", url: "/about" },
    { label: "Engagements", url: "/engagements" },
    { label: "Media", url: "/media" },
    { label: "Lessons", url: "/lessons" },
    { label: "Contact", url: "/contact" },
  ];
  const [mobileNavOpen, setMobileNav] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-background px-[2.5rem] py-2 max-xs:px-4">
      <Link href="/" className="flex items-center">
        <span className="mr-4 font-serif text-[2rem] font-bold max-xs:text-[1.5rem]">
          {brandName}
        </span>
        <SvgLogo className="w-24 fill-accent max-xs:w-16" />
      </Link>

      <nav className="grid grid-cols-[repeat(5,auto)] gap-8 max-md:hidden">
        {links.map((link) => (
          <Link key={`nav-${link.url}`} href={link.url}>
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

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNav}>
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
                <Link href={link.url} className="w-full text-center">
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
    </header>
  );
};

export default Header;
