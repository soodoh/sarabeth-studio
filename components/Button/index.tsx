import Link from "next/link";
import React from "react";
import styles from "./Button.module.scss";

type Props = {
  isInternal?: boolean;
  url: string;
  label: string;
  className?: string;
};

const Button = ({ isInternal, url, label, className }: Props) => {
  if (isInternal) {
    return (
      <Link href={url}>
        <a className={`${styles.container} ${className || ""}`}>{label}</a>
      </Link>
    );
  }
  return (
    <a href={url} className={`${styles.container} ${className || ""}`}>
      {label}
    </a>
  );
};

export default Button;
