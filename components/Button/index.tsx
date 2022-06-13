import React from "react";
import ArrowSvg from "../../public/arrow.svg";
import styles from "./Button.module.scss";

type Props = {
  label?: string;
  url: string;
};

const Button = ({ label, url }: Props) => (
  <a className={styles.container} href={url}>
    <div className={styles.buttonText}>{label || "Click Here"}</div>
    <ArrowSvg className={styles.arrowSvg} />
  </a>
);

export default Button;
