"use client";

import OffsetShadow from "@/components/OffsetShadow";
import { imageLoader } from "@/utils/client/contentful";
import NextImage from "next/image";
import React from "react";
import styles from "./BannerImage.module.css";
import type { ImageType } from "@/utils/types";

type Props = {
  image: ImageType;
  title: string;
};

const BannerImage = ({ title, image }: Props) => {
  return (
    <div className={styles.container}>
      <NextImage
        alt={image.description}
        blurDataURL={image.placeholder}
        className={styles.image}
        fill
        loader={imageLoader}
        placeholder="blur"
        priority
        sizes="100vw"
        src={image.url}
      />
      <OffsetShadow type="bannerTitle" direction="left">
        <h1 className={styles.text}>{title}</h1>
      </OffsetShadow>
    </div>
  );
};

export default BannerImage;
