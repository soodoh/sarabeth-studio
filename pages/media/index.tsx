import { GetStaticProps } from "next";
import React from "react";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageWrapper from "../../components/ImageWrapper";
import PageLayout from "../../components/PageLayout";
import WidthContainer from "../../components/WidthContainer";
import getCommonData from "../../utils/server/fetchers/common";
import getMediaData from "../../utils/server/fetchers/media";
import styles from "./Media.module.scss";
import type { PageProps } from "../../utils/server/fetchers/common";
import type { MediaData } from "../../utils/server/fetchers/media";
import "swiper/css";
import "swiper/css/navigation";

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
      <WidthContainer className={styles.container}>
        blah
        <Swiper
          slidesPerView={3}
          centeredSlides
          // autoHeight
          pagination={{ clickable: true }}
          navigation
          modules={[Pagination, Navigation]}
          className={styles.carousel}
        >
          {images.map((image) => (
            <SwiperSlide key={image.id}>
              <div className={styles.slide}>
                <ImageWrapper image={image} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </WidthContainer>
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
