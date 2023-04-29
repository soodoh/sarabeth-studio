import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "./Header.module.scss";
import LogoSvg from "../../public/logo.svg";
import Link from "../Link";

type LinkProps = {
  links: { label: string; url: string }[];
};

const Links = ({ links }: LinkProps) => {
  const router = useRouter();
  return (
    <>
      {links.map((link) => (
        <Link key={`nav-${link.url}`} href={link.url} legacyBehavior>
          <a className={styles.linkContainer}>
            <span
              className={`${link.url === router.route ? styles.activeLink : ""
                } ${styles.link}`}
            >
              {link.label}
            </span>
          </a>
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
      <Link href="/" legacyBehavior>
        <a className={styles.logoContainer}>
          <span className={styles.logoText}>{brandName}</span>
          <LogoSvg className={styles.logoSvg} />
        </a>
      </Link>

      <nav className={styles.navContainer}>
        <Links links={links} />
      </nav>

      <nav
        className={`${styles.mobileNavContainer} ${mobileNavOpen && styles.mobileNavOpen
          }`}
      >
        <Links links={links} />
      </nav>

      <button
        className={styles.mobileNavButton}
        onClick={() => setMobileNav(!mobileNavOpen)}
        aria-label="Open Navigation"
      >
        <div
          className={`${styles.hamburgerIcon} ${mobileNavOpen && styles.closeIcon
            }`}
        />
      </button>
    </header>
  );
};

export default Header;
