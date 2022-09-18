import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LogoSvg from "../../public/logo.svg";
import styles from "./Header.module.scss";

type Props = {
  brandName: string;
};

const Header = ({ brandName }: Props) => {
  const links: { label: string; url: string }[] = [
    { label: "About", url: "/about" },
    { label: "Engagements", url: "/engagements" },
    { label: "Media", url: "/media" },
    { label: "Lessons", url: "/lessons" },
    { label: "Contact", url: "/contact" },
  ];
  const [mobileNavOpen, setMobileNav] = useState(false);
  const router = useRouter();

  return (
    <header className={styles.container}>
      <Link href="/">
        <a className={styles.logoContainer}>
          <span className={styles.logoText}>{brandName}</span>
          <LogoSvg className={styles.logoSvg} />
        </a>
      </Link>

      <nav
        className={`${styles.navContainer} ${
          mobileNavOpen && styles.mobileNavOpen
        }`}
      >
        {links.map((link) => (
          <Link key={`nav-${link.url}`} href={link.url}>
            <a className={styles.linkContainer}>
              <span
                className={`${
                  link.url === router.route ? styles.activeLink : ""
                } ${styles.link}`}
              >
                {link.label}
              </span>
            </a>
          </Link>
        ))}
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
