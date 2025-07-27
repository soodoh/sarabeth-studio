import OffsetShadow from "@/components/OffsetShadow";
import React from "react";
import styles from "./TextHeading.module.css";

type Props = {
  text: string;
};

const TextHeading = ({ text }: Props) => {
  return (
    <OffsetShadow type="heading" direction="left">
      <h1 className={styles.text}>{text}</h1>
    </OffsetShadow>
  );
};

export default TextHeading;
