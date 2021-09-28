import { FluidObject } from 'gatsby-image';

export interface Markdown {
  childMarkdownRemark: {
    html: string;
  };
}

export interface Photo {
  id: string;
  title: string;
  description?: string;
  fluid?: FluidObject;
  thumbnail?: FluidObject;
  fullSize?: FluidObject;
}

export interface Video {
  id: string;
  label: string;
  thumbnail: {
    fluid: FluidObject;
  };
  link: string;
}

export interface VideoGroup {
  id: string;
  label: string;
  videos: Video[];
}

export interface AudioFile {
  id: string;
  title: string;
  subtitle: string;
  audio: {
    file: {
      url: string;
      fileName: string;
      contentType: string;
    };
  };
}

export interface AudioGroup {
  id: string;
  label: string;
  audioFiles: AudioFile[];
}

export interface AudioSectionProps {
  audioGroups: {
    id: string;
    label: string;
    audioFiles: AudioFile[];
  }[];
}

export interface LocationProps {
  location: {
    pathname: string;
  };
}

export interface Album {
  id: string;
  label: string;
  photos: Photo[];
}

export interface Engagement {
  id: string;
  endDate: string;
  startDate: string;
  role: string;
  label: string;
  company: string;
  link?: string;
}

export interface SocialMedia {
  id: string;
  link: string;
  source: string;
}
