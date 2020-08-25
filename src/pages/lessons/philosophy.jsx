import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import PhilosophySection from '../../components/Lessons/Philosophy';

const Philosophy = props => {
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

Philosophy.propTypes = {
  aboutDescription: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  currentRoute: PropTypes.string.isRequired,
  mainLogo: PropTypes.string,
  mainPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  phoneNumber: PropTypes.string,
  reviewLink: PropTypes.string,
};
Philosophy.defaultProps = {
  mainLogo: null,
  phoneNumber: null,
  reviewLink: null,
};

const PhilosophyWithData = ({ location }) => (
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
        currentRoute={location.pathname}
        mainLogo={data.contentfulLessons.mainLogo.file.url}
        mainPhoto={data.contentfulLessons.mainPhoto}
        phoneNumber={data.contentfulLessons.phoneNumber}
        reviewLink={data.contentfulLessons.reviewLink}
      />
    )}
  />
);

PhilosophyWithData.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default PhilosophyWithData;
