import { Jimp, JimpMime, ResizeStrategy } from "jimp";

type JimpType = Awaited<ReturnType<(typeof Jimp)["read"]>>;

const imageCache: Map<string, JimpType> = new Map();

export async function readImage(baseUrl: string): Promise<JimpType | null> {
  const cached = imageCache.get(baseUrl);
  if (cached) {
    console.log(`CACHED ${baseUrl.split("/").pop()}`);
    return Promise.resolve(cached);
  }
  const url = `${baseUrl}?w=100&q=50&fm=jpg`;
  return Jimp.read(url);
}

export const getPlaceholder = async (url: string) => {
  const image = await readImage(url);
  if (!image) {
    throw new TypeError(`getPlaceholder: failed to read URL: ${url}`);
  }
  image.resize({ w: 25, mode: ResizeStrategy.BICUBIC });
  const placeholder = await image.getBase64(JimpMime.gif);
  return placeholder;
};
