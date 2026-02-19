"use client";

import SvgLogo from "@/components/icons/Logo";
import LessonsPageSections from "@/components/LessonsPageSections";
import { Button } from "@/components/ui/button";
import WidthContainer from "@/components/WidthContainer";
import { brandButtonClasses, cn } from "@/lib/utils";
import { LessonsPages } from '@/utils/types';
import type { LessonsData } from '@/utils/types';
import Link from "next/link";
import { useState } from "react";

const LessonsPageContent = ({ lessonsData }: { lessonsData: LessonsData }) => {
  const { email, phoneNumber, reviewLink } = lessonsData;
  const [section, setSection] = useState(LessonsPages.About);

  return (
    <>
      <div className="flex justify-center bg-background-light max-sm:flex-col">
        {Object.values(LessonsPages).map((page) => (
          <Button
            variant="unstyled"
            size="unstyled"
            onClick={() => setSection(page)}
            className={cn(
              "cursor-pointer rounded-none border-none bg-transparent px-4 py-6 font-sans text-base font-bold uppercase",
              section === page
                ? "bg-accent text-background-light hover:bg-accent hover:text-background-light"
                : "text-foreground hover:bg-transparent hover:text-accent",
            )}
            key={page}
          >
            {page}
          </Button>
        ))}
      </div>
      <WidthContainer className="flex flex-col">
        <LessonsPageSections section={section} lessonsData={lessonsData} />
        <div className="flex flex-col items-center [&>h1]:m-0 [&>h1]:text-[2rem]">
          <SvgLogo className="w-40 fill-accent" />
          <h1>Contact</h1>
          <div className="my-4 flex flex-col items-center [&_a]:my-2">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={`tel:${phoneNumber.replaceAll(/\D+/g, "")}`}>{phoneNumber}</a>
          </div>
          <Link href="/contact" className={cn(brandButtonClasses, "my-2")}>
            Book a Lesson
          </Link>
          <Link href={reviewLink} className={cn(brandButtonClasses, "my-2")}>
            View Reviews
          </Link>
        </div>
      </WidthContainer>
    </>
  );
};

export default LessonsPageContent;
