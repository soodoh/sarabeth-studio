import type { Document } from "@contentful/rich-text-types";
import type { Asset as ContentfulAsset, EntrySkeletonType } from "contentful";
import { client, formatImage } from "@/utils/contentful";
import type { LessonsData } from "@/utils/types";

type LessonsFields = {
  title: string;
  bannerImage: ContentfulAsset;
  aboutDescription: Document;
  teachingPhilosophy: Document;
  studioExpectations: Document;
  socialMediaDescription: Document;
  socialMediaImage: ContentfulAsset;
  teachingResume: Document;
  reviewLink: string;
  phoneNumber: string;
  email: string;
  followLink: string;
};

type LessonsSkeleton = EntrySkeletonType<LessonsFields, "lessons">;

const getLessonsData = async (): Promise<LessonsData> => {
  const lessonsEntries = await client.getEntries<LessonsSkeleton>({
    content_type: "lessons",
  });
  const lessonsResponse = lessonsEntries.items[0]?.fields;
  const lessonsData: LessonsData = {
    title: String(lessonsResponse?.title ?? ""),
    bannerImage: await formatImage(
      lessonsResponse?.bannerImage as ContentfulAsset,
    ),
    aboutDescription: lessonsResponse?.aboutDescription as Document,
    teachingPhilosophy: lessonsResponse?.teachingPhilosophy as Document,
    studioExpectations: lessonsResponse?.studioExpectations as Document,
    socialMediaDescription: lessonsResponse?.socialMediaDescription as Document,
    socialMediaImage: await formatImage(
      lessonsResponse?.socialMediaImage as ContentfulAsset,
    ),
    teachingResume: lessonsResponse?.teachingResume as Document,
    reviewLink: String(lessonsResponse?.reviewLink ?? ""),
    phoneNumber: String(lessonsResponse?.phoneNumber ?? ""),
    email: String(lessonsResponse?.email ?? ""),
    followLink: String(lessonsResponse?.followLink ?? ""),
  };
  return lessonsData;
};

export default getLessonsData;
