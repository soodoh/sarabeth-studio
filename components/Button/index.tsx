import React from "react";
import ArrowSvg from "../../public/arrow.svg";
import styles from "./Button.module.scss";

interface Props {
  label?: string;
  url: string;
}

const Button = (props: Props) => (
  <a className={styles.container} href={props.url}>
    <div className={styles.buttonText}>{props.label || "Click Here"}</div>
    <ArrowSvg className={styles.arrowSvg} />
  </a>
);

export default Button;
