import { createClient, ContentfulClientApi } from 'contentful';

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string;
let _client: ContentfulClientApi;

export function getClient() {
  if (!_client) {
    _client = createClient({
      space,
      accessToken,
    });
  }
  return _client;
}

export interface SocialMediaLink {
  source: string;
  link: string;
}

export interface CommonData {
  location: string;
  brandName: string;
  socialMediaLinks: SocialMediaLink[];
}

export const getCommonData: () => Promise<CommonData> = async () => {
  const aboutResponse: any = (await getClient().getEntries({ content_type: 'about' }))?.items?.[0]?.fields;
  const socialResponse: any = (await getClient().getEntries({
    content_type: 'socialMedia',
    order: 'fields.order',
  }))?.items;
  const socialMediaLinks = socialResponse?.map(({ fields }: any): SocialMediaLink => ({
    source: fields?.source || '',
    link: fields?.link || '',
  })) || [];

  return {
    socialMediaLinks,
    location: aboutResponse?.location || '',
    brandName: aboutResponse?.title || 'Sarabeth Belon',
  };
};

export const getAboutData = async () => {
};

export const getEngagementsData = async () => {
};

export const getMediaData = async () => {
};

export const getLessonsData = async () => {
};

export const getContactData = async () => {
};
