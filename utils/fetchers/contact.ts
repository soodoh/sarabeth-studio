import { client, formatImage } from "@/utils/contentful";
import type { ContactData } from "@/utils/types";

const getContactData = async (): Promise<ContactData> => {
  // oxlint-disable-next-line typescript-eslint/no-explicit-any
  const contactEntries: any = await client.getEntries({
    content_type: "contact",
  });
  const contactResponse = contactEntries?.items?.[0]?.fields;

  return {
    bannerImage: await formatImage(contactResponse?.bannerImage),
  };
};

export default getContactData;
