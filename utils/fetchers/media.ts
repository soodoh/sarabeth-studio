import { client, formatImage, formatUrl } from "@/utils/contentful";
import type { MediaData } from "@/utils/types";

const getMediaData = async (): Promise<MediaData> => {
  // oxlint-disable-next-line typescript-eslint/no-explicit-any
  const mediaEntries: any = await client.getEntries({
    content_type: "mediaPage",
  });
  const mediaResponse = mediaEntries?.items?.[0]?.fields;

  const images = await Promise.all(mediaResponse?.images?.map(formatImage));
  // oxlint-disable-next-line typescript-eslint/no-explicit-any
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
