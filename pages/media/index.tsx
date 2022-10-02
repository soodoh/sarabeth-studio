import { GetStaticProps } from "next";
import NextImage from "next/future/image";
import React from "react";
import YouTube from "react-youtube";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import PageLayout from "../../components/PageLayout";
import TextHeading from "../../components/TextHeading";
import WidthContainer from "../../components/WidthContainer";
import { imageLoader } from "../../utils/client/contentful";
import getCommonData from "../../utils/server/fetchers/common";
import getMediaData from "../../utils/server/fetchers/media";
import styles from "./Media.module.scss";
import type { PageProps } from "../../utils/server/fetchers/common";
import type { MediaData } from "../../utils/server/fetchers/media";

const Media = ({
  commonData,
  images,
  videos,
  audio,
}: PageProps & MediaData) => {
  return (
    <PageLayout
      metadata={{
        title: "Sarabeth's Recordings & Photos",
        description:
          "Sarabeth Belón's media page: recordings, photos and videos. Listen to recordings of her opera arias and art songs. Clips of her performances are also available. View pictures from past performances, professional headshots and more. Photo credits included when viewing higher resolution images.",
        keywords: ["sarabeth belon media", "sarabeth belon recordings"],
      }}
      commonData={commonData}
    >
      <div className={styles.container}>
        <TextHeading text="Photos" />
        <Swiper
          className={styles.carousel}
          modules={[Pagination, Navigation]}
          navigation
          pagination={{ clickable: true }}
          slidesPerView="auto"
        >
          {images.map((image) => (
            <SwiperSlide style={{ width: "auto" }} key={image.id}>
              <NextImage
                alt={image.description}
                blurDataURL={image.blurDataUrl}
                className={styles.slide}
                height={image.height}
                loader={imageLoader}
                placeholder="blur"
                sizes="50vw"
                src={image.url}
                width={image.width}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <TextHeading text="Videos" />
        <div className={styles.videoContainer}>
          <iframe
            src="https://www.youtube.com/embed/videoseries?list=PL2ucJM2n3hm_c0L7-_dAnJ_Kajde66Id1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <TextHeading text="Audio" />
      </div>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [commonData, mediaData] = await Promise.all([
    getCommonData(),
    getMediaData(),
  ]);
  return { props: { commonData, ...mediaData } };
};

export default Media;
