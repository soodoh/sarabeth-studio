import React from "react";
import styles from "./ArrowButton.module.scss";
import ArrowSvg from "../../public/arrow.svg";

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
