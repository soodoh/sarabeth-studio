import React from "react";
import styles from "./Overlay.module.scss";

interface Props {
  type: "left" | "right";
  children: React.ReactNode;
}

const Overlay = ({ type, children }: Props) => (
  <div className={styles.container}>
    <div className={styles[type || "right"]} />
    {children}
  </div>
);

export default Overlay;
