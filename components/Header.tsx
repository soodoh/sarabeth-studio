import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LogoSvg from '../public/logo.svg';
import styles from '../styles/Header.module.css';

interface Props {
  brandName: string;
}

const Header = (props: Props) => {
  const links: { label: string; url: string; }[] = [
    { label: 'About', url: '/about' },
    { label: 'Engagements', url: '/engagements' },
    { label: 'Media', url: '/media' },
    { label: 'Lessons', url: '/lessons' },
    { label: 'Contact', url: '/contact' },
  ];
  const router = useRouter();

  return (
    <header className={styles.container}>
      <Link href="/">
        <a className={styles.logoContainer}>
          <span className={styles.logoText}>
            {props.brandName}
          </span>
          <LogoSvg className={styles.logoSvg} />
        </a>
      </Link>

      <div className={styles.linkContainer}>
        {links.map(link => (
          <Link key={`nav-${link.url}`} href={link.url}>
            <a className={`${link.url === router.route ? styles.activeLink : ''} ${styles.link}`}>
              {link.label}
            </a>
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
