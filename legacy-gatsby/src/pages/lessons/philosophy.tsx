import React, { ReactElement } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import PhilosophySection from '../../components/Lessons/Philosophy';
import { Photo, LocationProps } from '../../types';

interface PhilosophyProps {
  aboutDescription: string;
  contact: string;
  currentRoute: string;
  mainLogo: string;
  mainPhoto: Photo;
  phoneNumber: string;
  reviewLink: string;
}

const Philosophy = (props: PhilosophyProps): ReactElement => {
  const { aboutDescription, contact, currentRoute, mainLogo, mainPhoto, phoneNumber, reviewLink } = props;

  return (
    <>
      <Metadata
        title="Singing Lessons | Piano Lessons Los Angeles"
        description="Offering the very best singing and piano lessons in Los Angeles. Refine your voice, sing with ease, and perfect your piano skills. Book your lesson now!"
        keywords={['singing lessons los angeles', 'piano lessons los angeles', 'piano teacher los angeles']}
      />

      <Banner currentRoute={currentRoute} mainLogo={mainLogo} mainPhoto={mainPhoto}>
        <PhilosophySection aboutDescription={aboutDescription} contact={contact} phoneNumber={phoneNumber} reviewLink={reviewLink} />
      </Banner>
    </>
  );
};

const PhilosophyWithData = (props: LocationProps): ReactElement => (
  <StaticQuery
    query={graphql`
      query LessonsQuery {
        contentfulLessons {
          reviewLink
          contact
          phoneNumber
          mainDescription {
            childMarkdownRemark {
              html
            }
          }
          aboutDescription {
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
      <Philosophy
        aboutDescription={data.contentfulLessons.aboutDescription.childMarkdownRemark.html}
        contact={data.contentfulLessons.contact}
        currentRoute={props.location.pathname}
        mainLogo={data.contentfulLessons.mainLogo.file.url}
        mainPhoto={data.contentfulLessons.mainPhoto}
        phoneNumber={data.contentfulLessons.phoneNumber}
        reviewLink={data.contentfulLessons.reviewLink}
      />
    )}
  />
);

export default PhilosophyWithData;
