import sharp from "sharp";

export async function readImage(baseUrl: string): Promise<sharp.Sharp> {
  const url = `${baseUrl}?w=100&q=50&fm=jpg`;
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return sharp(arrayBuffer).jpeg();
}

export const getPlaceholder = async (url: string) => {
  const image = await readImage(url);
  const imageBuffer = await image.resize(25).blur().toBuffer();
  const placeholder = `data:image/jpg;base64,${imageBuffer.toString("base64")}`;
  return placeholder;
};
