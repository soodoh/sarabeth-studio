import React from "react";
import styles from "./Button.module.scss";

type Props = {
  url?: string;
  label: string;
  className?: string;
};

const Button = ({ url, label, className }: Props) => {
  return (
    <a href={url} className={`${styles.container} ${className || ""}`}>
      {label}
    </a>
  );
};

export default Button;
