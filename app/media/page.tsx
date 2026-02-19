import AudioPlayer from "@/components/AudioPlayer";
import PhotoCarousel from "@/components/PhotoCarousel";
import TextHeading from "@/components/TextHeading";
import WidthContainer from "@/components/WidthContainer";
import getMediaData from "@/utils/fetchers/media";
import type { Metadata } from "next";

// Statically generated at build time, will error if any Dynamic APIs are used
export const dynamic = "error";

export const metadata: Metadata = {
  title: "Sarabeth's Recordings & Photos",
  description:
    "Sarabeth Belón's media page: recordings, photos and videos. Listen to recordings of her opera arias and art songs. Clips of her performances are also available. View pictures from past performances, professional headshots and more. Photo credits included when viewing higher resolution images.",
  keywords: ["sarabeth belon media", "sarabeth belon recordings"],
  icons: "/favicon.png",
};

export default async function MediaPage(): Promise<JSX.Element> {
  const { images, audio } = await getMediaData();

  return (
    <div className="flex flex-col items-center">
      <TextHeading text="Photos" />
      <PhotoCarousel images={images} />

      <TextHeading text="Videos" />
      <div className="relative mx-auto mt-4 mb-8 h-[35rem] w-full max-w-[1200px] px-[2.5rem] max-sm:h-[20rem] [&_embed]:absolute [&_embed]:inset-0 [&_embed]:h-full [&_embed]:w-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_object]:absolute [&_object]:inset-0 [&_object]:h-full [&_object]:w-full">
        <iframe
          src="https://www.youtube.com/embed/videoseries?list=PL2ucJM2n3hm_c0L7-_dAnJ_Kajde66Id1"
          title="YouTube video player"
          frameBorder="0"
          sandbox="allow-scripts allow-presentation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <TextHeading text="Audio" />
      <WidthContainer>
        {audio.map((audioFile) => (
          <div className="my-8" key={audioFile.id}>
            <div className="my-2 flex items-center">
              <h2 className="m-0 mr-8 font-sans text-base">
                {audioFile.title}
              </h2>
              <span className="font-sans">{audioFile.description}</span>
            </div>
            <AudioPlayer source={audioFile.url} />
          </div>
        ))}
      </WidthContainer>
    </div>
  );
}
