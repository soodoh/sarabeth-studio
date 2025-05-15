import SvgArrow from "@/components/icons/Arrow";
import React from "react";
import styles from "./ArrowButton.module.css";

type Props = {
  label: string | null;
  url: string;
};

const Button = ({ label, url }: Props) => (
  <a className={styles.container} href={url}>
    <div className={styles.buttonText}>{label || "Click Here"}</div>
    <SvgArrow className={styles.arrowSvg} />
  </a>
);

export default Button;
