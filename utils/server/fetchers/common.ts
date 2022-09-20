import { getClient } from "../contentful";

export type SocialMediaLink = {
  source: string;
  link: string;
};
export type CommonData = {
  location: string;
  brandName: string;
  socialMediaLinks: SocialMediaLink[];
};

export type PageProps = {
  commonData: CommonData;
};

const getCommonData = async (): Promise<CommonData> => {
  const client = getClient();
  const [aboutResponse, socialResponse]: any[] = await Promise.all([
    client.getEntries({ content_type: "about" }),
    client.getEntries({ content_type: "socialMedia", order: "fields.order" }),
  ]);
  const socialMediaLinks =
    socialResponse?.items?.map(
      ({ fields }: any): SocialMediaLink => ({
        source: fields?.source || "",
        link: fields?.link || "",
      })
    ) || [];

  return {
    socialMediaLinks,
    location: aboutResponse?.items?.[0]?.fields?.location || "",
    brandName: aboutResponse?.items?.[0]?.fields?.title || "Sarabeth Belón",
  };
};

export default getCommonData;
