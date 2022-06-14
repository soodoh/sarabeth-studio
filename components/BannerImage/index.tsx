import React from "react";
import { Image } from "../../utils/contentful";
import Overlay from "../Overlay";
import styles from "./BannerImage.module.scss";

type Props = {
  image: Image;
  title: string;
};

const BannerImage = ({ title, image }: Props) => {
  return (
    <div
      className={styles.container}
      style={{ backgroundImage: `url("${image.url}")` }}
    >
      <Overlay type="left">{title}</Overlay>
    </div>
  );
};

export default BannerImage;
