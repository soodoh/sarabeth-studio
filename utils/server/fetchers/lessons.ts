import { client, formatImage } from "../contentful";
import type { LessonsData } from "../../types";

const getLessonsData = async (): Promise<LessonsData> => {
  const lessonsResponse: any = (
    await client.getEntries({
      content_type: "lessons",
    })
  )?.items?.[0]?.fields;
  const lessonsData = {
    title: lessonsResponse?.title,
    bannerImage: await formatImage(lessonsResponse?.bannerImage),
    aboutDescription: lessonsResponse?.aboutDescription,
    teachingPhilosophy: lessonsResponse?.teachingPhilosophy,
    studioExpectations: lessonsResponse?.studioExpectations,
    socialMediaDescription: lessonsResponse?.socialMediaDescription,
    socialMediaImage: await formatImage(lessonsResponse?.socialMediaImage),
    teachingResume: lessonsResponse?.teachingResume,
    reviewLink: lessonsResponse?.reviewLink,
    phoneNumber: lessonsResponse?.phoneNumber,
    email: lessonsResponse?.email,
    followLink: lessonsResponse?.followLink,
  };
  return lessonsData;
};

export default getLessonsData;
