import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import LogoSvg from "../../public/logo.svg";
import styles from "./Header.module.scss";

interface Props {
  brandName: string;
}

const Header = (props: Props) => {
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
          <span className={styles.logoText}>{props.brandName}</span>
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
