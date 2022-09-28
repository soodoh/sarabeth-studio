import { formatImage, formatUrl, getClient } from "../contentful";
import type { Image } from "../contentful";

export type Video = {
  id: string;
  title: string;
  youtubeId: string;
};

export type Audio = {
  id: string;
  title: string;
  url: string;
};

export type MediaData = {
  images: Image[];
  videos: Video[];
  audio: Audio[];
};

const getMediaData = async (): Promise<MediaData> => {
  const client = getClient();
  const mediaResponse: any = (
    await client.getEntries({ content_type: "mediaPage" })
  )?.items?.[0]?.fields;

  const images = await Promise.all(mediaResponse?.images?.map(formatImage));
  const videos = mediaResponse?.videos?.map((video: any) => ({
    id: video?.sys?.id,
    title: video?.fields?.label,
    youtubeId: video?.fields?.youtubeId,
  }));
  const audio = mediaResponse?.audio?.map((song: any) => {
    return {
      id: song?.sys?.id,
      title: song?.fields?.title,
      url: formatUrl(song?.fields?.file?.url),
    };
  });
  return { images, videos, audio };
};

export default getMediaData;
