"use client";

import SvgLogo from "@/components/icons/Logo";
import classNames from "classnames/bind";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import styles from "./Header.module.css";

const cx = classNames.bind(styles);

type LinkProps = {
  links: { label: string; url: string }[];
  onClick?: () => void;
};

const Links = ({ links, onClick }: LinkProps) => {
  const route = usePathname();
  return (
    <>
      {links.map((link) => (
        <Link
          key={`nav-${link.url}`}
          href={link.url}
          className={styles.linkContainer}
          onClick={onClick}
        >
          <span
            className={cx(styles.link, {
              activeLink: link.url === route,
            })}
          >
            {link.label}
          </span>
        </Link>
      ))}
    </>
  );
};

type HeaderProps = {
  brandName: string;
};

const Header = ({ brandName }: HeaderProps) => {
  const links = [
    { label: "About", url: "/about" },
    { label: "Engagements", url: "/engagements" },
    { label: "Media", url: "/media" },
    { label: "Lessons", url: "/lessons" },
    { label: "Contact", url: "/contact" },
  ];
  const [mobileNavOpen, setMobileNav] = useState(false);

  return (
    <header className={styles.container}>
      <Link href="/" className={styles.logoContainer}>
        <span className={styles.logoText}>{brandName}</span>
        <SvgLogo className={styles.logoSvg} />
      </Link>

      <nav className={styles.navContainer}>
        <Links links={links} />
      </nav>

      <nav className={cx(styles.mobileNavContainer, { mobileNavOpen })}>
        <Links links={links} onClick={() => setMobileNav(false)} />
      </nav>

      <button
        className={styles.mobileNavButton}
        onClick={() => setMobileNav(!mobileNavOpen)}
        aria-label="Open Navigation"
      >
        <div
          className={cx(styles.hamburgerIcon, { closeIcon: mobileNavOpen })}
        />
      </button>
    </header>
  );
};

export default Header;
