import SocialIcon from "@/components/SocialIcon";
import Link from "next/link";
import React from "react";
import styles from "./Footer.module.css";
import type { SocialMediaLink } from "@/utils/types";

type Props = {
  socialMediaLinks: SocialMediaLink[];
  location: string;
};

const Footer = ({ location, socialMediaLinks }: Props) => {
  return (
    <footer className={styles.container}>
      <div className={styles.left}>
        <span>{location}</span>
        <span>Copyright ©{new Date().getFullYear()} Sarabeth Belón</span>
      </div>
      <div className={styles.socialLinkContainer}>
        {socialMediaLinks.map((socialLink) => (
          <Link
            key={`footer-link-${socialLink.source}`}
            className={styles.socialLink}
            href={socialLink.link}
            aria-label={`Link to Sarabeth's ${socialLink.source}`}
          >
            <SocialIcon
              source={socialLink.source}
              className={styles.socialSvg}
            />
          </Link>
        ))}
      </div>
      <div className={styles.right}>
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
