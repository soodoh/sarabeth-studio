import { client, formatImage } from "@/utils/server/contentful";
import type { ContactData } from "@/utils/types";

const getContactData = async (): Promise<ContactData> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contactResponse: any = (
    await client.getEntries({
      content_type: "contact",
    })
  )?.items?.[0]?.fields;

  return {
    bannerImage: await formatImage(contactResponse?.bannerImage),
  };
};

export default getContactData;
