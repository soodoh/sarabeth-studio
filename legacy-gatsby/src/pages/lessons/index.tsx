import React, { ReactElement } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import About from '../../components/Lessons/About';
import { Photo, LocationProps } from '../../types';

interface LessonsProps {
  currentRoute: string;
  reviewLink: string;
  contact: string;
  phoneNumber: string;
  mainPhoto: Photo;
  voiceLessons: string;
  pianoLessons: string;
  mainLogo: string;
  pianoLessonsSvg: string;
  voiceLessonsSvg: string;
}

const Lessons = (props: LessonsProps): ReactElement => {
  const {
    contact,
    currentRoute,
    mainLogo,
    mainPhoto,
    phoneNumber,
    pianoLessons,
    pianoLessonsSvg,
    reviewLink,
    voiceLessons,
    voiceLessonsSvg,
  } = props;

  return (
    <>
      <Metadata
        title="Singing Lessons | Piano Lessons Los Angeles"
        description="Offering the very best singing and piano lessons in Los Angeles. Refine your voice, sing with ease, and perfect your piano skills. Book your lesson now!"
        keywords={['singing lessons los angeles', 'piano lessons los angeles']}
      />

      <Banner currentRoute={currentRoute} mainLogo={mainLogo} mainPhoto={mainPhoto}>
        <About
          contact={contact}
          phoneNumber={phoneNumber}
          pianoLessons={pianoLessons}
          pianoLessonsSvg={pianoLessonsSvg}
          reviewLink={reviewLink}
          voiceLessons={voiceLessons}
          voiceLessonsSvg={voiceLessonsSvg}
        />
      </Banner>
    </>
  );
};

const LessonsWithData = (props: LocationProps): ReactElement => (
  <StaticQuery
    query={graphql`
      query AboutLessonsQuery {
        contentfulLessons {
          reviewLink
          contact
          phoneNumber
          mainPhoto {
            title
            description
            fluid(maxWidth: 1280) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          voiceLessons {
            childMarkdownRemark {
              html
            }
          }
          pianoLessons {
            childMarkdownRemark {
              html
            }
          }
          mainLogo {
            file {
              url
            }
          }
          voiceLessonsImage {
            file {
              url
            }
          }
          pianoLessonsImage {
            file {
              url
            }
          }
        }
      }
    `}
    render={data => (
      <Lessons
        contact={data.contentfulLessons.contact}
        currentRoute={props.location.pathname}
        mainLogo={data.contentfulLessons.mainLogo.file.url}
        mainPhoto={data.contentfulLessons.mainPhoto}
        phoneNumber={data.contentfulLessons.phoneNumber}
        pianoLessons={data.contentfulLessons.pianoLessons.childMarkdownRemark.html}
        pianoLessonsSvg={data.contentfulLessons.pianoLessonsImage.file.url}
        reviewLink={data.contentfulLessons.reviewLink}
        voiceLessons={data.contentfulLessons.voiceLessons.childMarkdownRemark.html}
        voiceLessonsSvg={data.contentfulLessons.voiceLessonsImage.file.url}
      />
    )}
  />
);

export default LessonsWithData;
