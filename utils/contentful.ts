import type { AssetFields, Asset as ContentfulAsset } from "contentful";
import { createClient } from "contentful";
import type { Asset, ImageType } from "@/utils/types";
import { getPlaceholder } from "./image";

export const client = createClient({
  // biome-ignore lint/style/noNonNullAssertion: env vars required at build time
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  // biome-ignore lint/style/noNonNullAssertion: env vars required at build time
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
});

export function formatUrl(baseUrl: string): string {
  return `https:${baseUrl}`;
}

export function formatAsset(asset: ContentfulAsset): Asset {
  const fields = asset.fields as AssetFields;
  const assetUrl = formatUrl(String(fields.file?.url ?? ""));
  return {
    id: asset.sys.id,
    title: String(fields.title ?? ""),
    description: String(fields.description ?? ""),
    url: assetUrl,
  };
}

const imageCache = new Map<string, ImageType>();

export async function formatImage(
  contentfulAsset: ContentfulAsset,
): Promise<ImageType> {
  const asset = formatAsset(contentfulAsset);
  const cached = imageCache.get(asset.id);
  if (cached) {
    return cached;
  }

  const fields = contentfulAsset.fields as AssetFields;
  const imageDetails = fields.file?.details;
  const width = imageDetails?.image?.width ?? 0;
  const height = imageDetails?.image?.height ?? 0;
  const placeholder = await getPlaceholder(asset.url);

  const image: ImageType = {
    ...asset,
    width,
    height,
    placeholder,
  };
  imageCache.set(asset.id, image);

  return image;
}
