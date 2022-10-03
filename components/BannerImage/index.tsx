import NextImage from "next/image";
import React from "react";
import { imageLoader } from "../../utils/client/contentful";
import Overlay from "../Overlay";
import styles from "./BannerImage.module.scss";
import type { Image } from "../../utils/types";

type Props = {
  image: Image;
  title: string;
};

const BannerImage = ({ title, image }: Props) => {
  return (
    <div className={styles.container}>
      <NextImage
        className={styles.image}
        loader={imageLoader}
        placeholder="blur"
        blurDataURL={image.blurDataUrl}
        src={image.url}
        alt={image.description}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        sizes="100vw"
      />
      <Overlay type="bannerTitle" direction="left">
        <h1 className={styles.text}>{title}</h1>
      </Overlay>
    </div>
  );
};

export default BannerImage;
