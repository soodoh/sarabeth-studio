import { getClient } from "../contentful";

export interface SocialMediaLink {
  source: string;
  link: string;
}
export interface CommonData {
  location: string;
  brandName: string;
  socialMediaLinks: SocialMediaLink[];
}

export interface PageProps {
  commonData: CommonData;
}

const getCommonData = async (): Promise<CommonData> => {
  const aboutResponse: any = (
    await getClient().getEntries({ content_type: "about" })
  )?.items?.[0]?.fields;
  const socialResponse: any = (
    await getClient().getEntries({
      content_type: "socialMedia",
      order: "fields.order",
    })
  )?.items;
  const socialMediaLinks =
    socialResponse?.map(
      ({ fields }: any): SocialMediaLink => ({
        source: fields?.source || "",
        link: fields?.link || "",
      })
    ) || [];

  return {
    socialMediaLinks,
    location: aboutResponse?.location || "",
    brandName: aboutResponse?.title || "Sarabeth Belón",
  };
};

export default getCommonData;
