/* oxlint-disable typescript-eslint/explicit-module-boundary-types */
import BannerImage from "@/components/BannerImage";
import LessonsPageContent from "@/components/LessonsPageContent";
import getLessonsData from "@/utils/fetchers/lessons";
import type { Metadata } from "next";

// Statically generated at build time, will error if any Dynamic APIs are used
export const dynamic = "error";

export const metadata: Metadata = {
  title: "Singing Lessons | Los Angeles",
  description:
    "Offering the very best singing lessons in Los Angeles. Refine your voice, sing with ease, and perfect your craft. Book your lesson now!",
  keywords: [
    "singing lessons los angeles",
    "voice lessons los angeles",
    "singing coach los angeles",
  ],
  icons: "/favicon.png",
};

export default async function LessonsPage() {
  const lessonsData = await getLessonsData();

  return (
    <>
      <BannerImage image={lessonsData.bannerImage} title={lessonsData.title} />
      <LessonsPageContent lessonsData={lessonsData} />
    </>
  );
}
