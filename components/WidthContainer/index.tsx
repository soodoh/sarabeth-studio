import React from "react";
import styles from "./WidthContainer.module.scss";

type Props = { children: React.ReactNode; className: string };

const WidthContainer = ({ children, className }: Props) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>{children}</div>
  );
};

export default WidthContainer;
