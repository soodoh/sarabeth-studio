import { client, formatImage, formatUrl } from "@/utils/server/contentful";
import type { MediaData } from "@/utils/types";

const getMediaData = async (): Promise<MediaData> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mediaResponse: any = (
    await client.getEntries({ content_type: "mediaPage" })
  )?.items?.[0]?.fields;

  const images = await Promise.all(mediaResponse?.images?.map(formatImage));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audio = mediaResponse?.audio?.map((song: any) => {
    return {
      id: song?.sys?.id,
      title: song?.fields?.title,
      description: song?.fields?.description || "",
      url: formatUrl(song?.fields?.file?.url),
    };
  });
  return { images, audio };
};

export default getMediaData;
