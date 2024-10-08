import { client, formatImage } from "../contentful";
import type { ContactData } from "../../types";

const getContactData = async (): Promise<ContactData> => {
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
