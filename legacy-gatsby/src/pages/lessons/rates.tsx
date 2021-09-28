import React, { ReactElement } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import LessonsInfo from '../../components/Lessons/LessonsInfo';
import { Photo, LocationProps } from '../../types';

interface RatesProps {
  availability: string;
  contact: string;
  currentRoute: string;
  location: string;
  mainDescription: string;
  mainLogo: string;
  mainPhoto: Photo;
  phoneNumber: string;
  reviewLink: string;
}

const Rates = (props: RatesProps): ReactElement => {
  const { availability, contact, currentRoute, location, mainDescription, mainLogo, mainPhoto, phoneNumber, reviewLink } = props;

  return (
    <>
      <Metadata
        title="Singing Lessons | Piano Lessons Los Angeles"
        description="Offering the very best singing and piano lessons in Los Angeles. Refine your voice, sing with ease, and perfect your piano skills. Book your lesson now!"
        keywords={['singing lessons los angeles', 'piano lessons los angeles']}
      />

      <Banner currentRoute={currentRoute} mainLogo={mainLogo} mainPhoto={mainPhoto}>
        <LessonsInfo
          mainDescription={mainDescription}
          availability={availability}
          contact={contact}
          phoneNumber={phoneNumber}
          location={location}
          reviewLink={reviewLink}
        />
      </Banner>
    </>
  );
};

const RatesWithData = (props: LocationProps): ReactElement => (
  <StaticQuery
    query={graphql`
      query LessonRatesQuery {
        contentfulLessons {
          location
          contact
          phoneNumber
          reviewLink
          teachingResume {
            childMarkdownRemark {
              html
            }
          }
          availability {
            childMarkdownRemark {
              html
            }
          }
          mainDescription {
            childMarkdownRemark {
              html
            }
          }
          mainLogo {
            file {
              url
            }
          }
          mainPhoto {
            title
            description
            fluid(maxWidth: 1280) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    `}
    render={data => (
      <Rates
        availability={data.contentfulLessons.availability.childMarkdownRemark.html}
        contact={data.contentfulLessons.contact}
        currentRoute={props.location.pathname}
        location={data.contentfulLessons.location}
        mainDescription={data.contentfulLessons.mainDescription.childMarkdownRemark.html}
        mainLogo={data.contentfulLessons.mainLogo.file.url}
        mainPhoto={data.contentfulLessons.mainPhoto}
        phoneNumber={data.contentfulLessons.phoneNumber}
        reviewLink={data.contentfulLessons.reviewLink}
      />
    )}
  />
);

export default RatesWithData;
