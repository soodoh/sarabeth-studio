export type Image = {
  id: string;
  url: string;
  title: string;
  description: string;
  width: number;
  height: number;
  blurDataUrl: string;
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

export type Audio = {
  id: string;
  title: string;
  description: string;
  url: string;
};
