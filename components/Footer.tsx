import React from "react";
import { getClient, SocialMediaLink } from "../util/contentful-util";
import { SocialIcon } from "../components/SocialIcon";
import styles from "../styles/Footer.module.css";

interface Props {
  socialMediaLinks: SocialMediaLink[];
  location: string;
}

const Footer = (props: Props) => {
  return (
    <footer className={styles.container}>
      <div className={styles.left}>
        <span>{props.location}</span>
        <span>Copyright ©{new Date().getFullYear()} Sarabeth Belón</span>
      </div>
      <div className={styles.socialLinkContainer}>
        {props.socialMediaLinks.map((socialLink) => (
          <a
            key={`footer-link-${socialLink.source}`}
            className={styles.socialLink}
            href={socialLink.link}
          >
            <SocialIcon
              source={socialLink.source}
              className={styles.socialSvg}
            />
          </a>
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
