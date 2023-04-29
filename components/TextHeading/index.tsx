import React from "react";
import styles from "./TextHeading.module.scss";
import Overlay from "../Overlay";

type Props = {
  text: string;
};

const TextHeading = ({ text }: Props) => {
  return (
    <Overlay type="heading" direction="left">
      <h1 className={styles.text}>{text}</h1>
    </Overlay>
  );
};

export default TextHeading;
