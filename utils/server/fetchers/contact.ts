import { formatImage, getClient } from "../contentful";
import type { Image } from "../contentful";

export type ContactData = {
  submitPostUrl: string;
  bannerImage: Image;
};

const getContactData = async (): Promise<ContactData> => {
  const client = getClient();
  const contactResponse: any = (
    await client.getEntries({
      content_type: "contact",
    })
  )?.items?.[0]?.fields;

  return {
    submitPostUrl: contactResponse?.awsUrl,
    bannerImage: await formatImage(contactResponse?.bannerImage),
  };
};

export default getContactData;
