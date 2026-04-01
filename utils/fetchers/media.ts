import type {
  AssetFields,
  Asset as ContentfulAsset,
  EntrySkeletonType,
} from "contentful";
import { client, formatImage, formatUrl } from "@/utils/contentful";
import type { Audio, ImageType, MediaData } from "@/utils/types";

type MediaPageFields = {
  images: ContentfulAsset[];
  audio: ContentfulAsset[];
};

type MediaPageSkeleton = EntrySkeletonType<MediaPageFields, "mediaPage">;

const getMediaData = async (): Promise<MediaData> => {
  const mediaEntries = await client.getEntries<MediaPageSkeleton>({
    content_type: "mediaPage",
  });
  const mediaResponse = mediaEntries.items[0]?.fields;

  const images: ImageType[] = await Promise.all(
    ((mediaResponse?.images as ContentfulAsset[]) ?? []).map(formatImage),
  );
  const audio: Audio[] = (
    (mediaResponse?.audio as ContentfulAsset[]) ?? []
  ).map((song) => {
    const fields = song.fields as AssetFields;
    return {
      id: song.sys.id,
      title: String(fields.title ?? ""),
      description: String(fields.description ?? ""),
      url: formatUrl(String(fields.file?.url ?? "")),
    };
  });
  return { images, audio };
};

export default getMediaData;
