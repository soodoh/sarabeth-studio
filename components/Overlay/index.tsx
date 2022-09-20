import React from "react";
import styles from "./Overlay.module.scss";

type Props = {
  direction: "left" | "right";
  type: "bannerTitle" | "image" | "heading";
  children: React.ReactNode;
};

const Overlay = ({ type, direction, children }: Props) => (
  <div className={styles.container}>
    <div className={`${styles.overlay} ${styles[type]} ${styles[direction]}`} />
    <div className={styles.content}>{children}</div>
  </div>
);

export default Overlay;
