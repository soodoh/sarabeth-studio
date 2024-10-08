export type Asset = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export type ImageType = Asset & {
  width: number;
  height: number;
  placeholder: string;
  dominantColor?: string;
};

export type SocialMediaLink = {
  source: string;
  link: string;
};

export type EmailData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type Audio = Asset;
