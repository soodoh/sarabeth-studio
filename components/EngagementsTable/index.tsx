/* oxlint-disable typescript-eslint/explicit-module-boundary-types */
import TextHeading from "@/components/TextHeading";
import { brandButtonClasses, cn } from "@/lib/utils";
import React from "react";
import type { Engagement } from "@/utils/types";

type Props = {
  engagements: Engagement[];
  label: "Upcoming" | "Past";
};

const formatDate = (dateString: string, includeYear = false) => {
  const date = new Date(dateString);
  const formattedString = date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    ...(includeYear && { year: "numeric" }),
  });
  return formattedString;
};

const EngagementRow = ({ engagements, label }: Props) => {
  return (
    <div className="mb-8 flex w-full flex-col items-center">
      <TextHeading text={label} />

      <div className="mt-4 w-full">
        {engagements.map(
          ({ id, title, company, role, link, startDate, endDate }, index) => (
            <div
              key={id}
              className={cn(
                "grid grid-cols-[15rem_1fr_15rem] items-center py-4 max-md:grid-cols-1 max-md:gap-5",
                index < engagements.length - 1 && "border-b border-accent",
              )}
            >
              <div className="flex flex-col max-md:justify-self-center">
                <span className="italic">Performing as</span>
                <span className="font-bold uppercase tracking-[0.2rem]">
                  {role}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[1.2rem] font-bold">{title}</span>
                <span>{company}</span>
                <span className="text-[0.75rem]">
                  {formatDate(startDate)} - {formatDate(endDate, true)}
                </span>
              </div>
              <a
                href={link}
                className={cn(
                  brandButtonClasses,
                  "justify-self-end max-md:justify-self-center",
                )}
              >
                {label === "Upcoming" ? "Buy Tickets" : "Company Info"}
              </a>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default EngagementRow;
