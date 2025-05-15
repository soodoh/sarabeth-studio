import AudioPlayer from "@/components/AudioPlayer";
import PhotoCarousel from "@/components/PhotoCarousel";
import TextHeading from "@/components/TextHeading";
import WidthContainer from "@/components/WidthContainer";
import getMediaData from "@/utils/server/fetchers/media";
import React from "react";
import styles from "./Media.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sarabeth's Recordings & Photos",
  description:
    "Sarabeth Belón's media page: recordings, photos and videos. Listen to recordings of her opera arias and art songs. Clips of her performances are also available. View pictures from past performances, professional headshots and more. Photo credits included when viewing higher resolution images.",
  keywords: ["sarabeth belon media", "sarabeth belon recordings"],
  icons: "/favicon.png",
};

export default async function MediaPage() {
  const { images, audio } = await getMediaData();

  return (
    <>
      <div className={styles.container}>
        <TextHeading text="Photos" />
        <PhotoCarousel images={images} />

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
        <WidthContainer>
          {audio.map((audioFile) => (
            <div className={styles.audioContainer} key={audioFile.id}>
              <div className={styles.songTitleContainer}>
                <h2 className={styles.songTitle}>{audioFile.title}</h2>
                <span className={styles.songDescription}>
                  {audioFile.description}
                </span>
              </div>
              <AudioPlayer source={audioFile.url} />
            </div>
          ))}
        </WidthContainer>
      </div>
    </>
  );
}
