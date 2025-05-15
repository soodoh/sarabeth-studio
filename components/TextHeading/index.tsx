import Overlay from "@/components/Overlay";
import React from "react";
import styles from "./TextHeading.module.css";

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
