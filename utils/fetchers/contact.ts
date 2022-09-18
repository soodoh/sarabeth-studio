import { getClient } from "../contentful";

export type ContactData = {
  submitPostUrl: string;
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
  };
};

export default getContactData;
