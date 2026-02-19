import { client } from "@/utils/contentful";
import type { CommonData, SocialMediaLink } from "@/utils/types";

const getCommonData = async (): Promise<CommonData> => {
  // oxlint-disable-next-line typescript-eslint/no-explicit-any
  const [aboutResponse, socialResponse]: any[] = await Promise.all([
    client.getEntries({ content_type: "about" }),
    client.getEntries({ content_type: "socialMedia", order: ["fields.order"] }),
  ]);
  const socialMediaLinks =
    socialResponse?.items?.map(
      // oxlint-disable-next-line typescript-eslint/no-explicit-any
      ({ fields }: any): SocialMediaLink => ({
        source: fields?.source || "",
        link: fields?.link || "",
      }),
    ) || [];

  return {
    socialMediaLinks,
    location: aboutResponse?.items?.[0]?.fields?.location || "",
    brandName: aboutResponse?.items?.[0]?.fields?.title || "Sarabeth Belón",
  };
};

export default getCommonData;
