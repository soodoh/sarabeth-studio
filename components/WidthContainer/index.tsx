import classNames from "classnames/bind";
import React from "react";
import styles from "./WidthContainer.module.css";

const cx = classNames.bind(styles);

type Props = { children: React.ReactNode; className?: string };

const WidthContainer = ({ children, className }: Props) => {
  return <div className={cx(styles.container, className)}>{children}</div>;
};

export default WidthContainer;
