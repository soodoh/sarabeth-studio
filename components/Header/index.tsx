"use client";

import SvgLogo from "@/components/icons/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import styles from "./Header.module.css";

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
            className={`${
              link.url === route ? styles.activeLink : ""
            } ${styles.link}`}
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

      <nav
        className={`${styles.mobileNavContainer} ${
          mobileNavOpen && styles.mobileNavOpen
        }`}
      >
        <Links links={links} onClick={() => setMobileNav(false)} />
      </nav>

      <button
        className={styles.mobileNavButton}
        onClick={() => setMobileNav(!mobileNavOpen)}
        aria-label="Open Navigation"
      >
        <div
          className={`${styles.hamburgerIcon} ${
            mobileNavOpen && styles.closeIcon
          }`}
        />
      </button>
    </header>
  );
};

export default Header;
