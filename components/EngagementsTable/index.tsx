import TextHeading from "@/components/TextHeading";
import buttonStyles from "@/styles/Button.module.css";
import classNames from "classnames/bind";
import React from "react";
import styles from "./EngagementsTable.module.css";
import type { Engagement } from "@/utils/types";

const cx = classNames.bind(styles);

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
    <div className={styles.container}>
      <TextHeading text={label} />

      <div className={styles.rowContainer}>
        {engagements.map(
          ({ id, title, company, role, link, startDate, endDate }, index) => (
            <div
              key={id}
              className={cx(styles.row, {
                rowBorder: index < engagements.length - 1,
              })}
            >
              <div className={styles.roleContainer}>
                <span className={styles.roleLabel}>Performing as</span>
                <span className={styles.roleText}>{role}</span>
              </div>
              <div className={styles.middleContainer}>
                <span className={styles.title}>{title}</span>
                <span className={styles.company}>{company}</span>
                <span className={styles.date}>
                  {formatDate(startDate)} - {formatDate(endDate, true)}
                </span>
              </div>
              <a
                href={link}
                className={`${buttonStyles.container} ${styles.buttonContainer}`}
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
