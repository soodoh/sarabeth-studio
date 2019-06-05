import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import LessonsInfo from '../../components/Lessons/LessonsInfo';

const Rates = (props) => {
  const {
    location, currentRoute, mainDescription, availability,
    contact, reviewLink, phoneNumber, mainPhoto,
  } = props;

  return (
    <React.Fragment>
      <Metadata
        title="Singing Lessons | Piano Lessons Los Angeles"
        description="Offering the very best singing and piano lessons in Los Angeles. Refine your voice, sing with ease, and perfect your piano skills. Book your lesson now!"
        keywords={[
          'singing lessons los angeles',
          'piano lessons los angeles',
          'voice lessons los angeles',
          'singing coach los angeles',
          'piano teacher los angeles',
        ]}
      />

      <Banner mainPhoto={mainPhoto} currentRoute={currentRoute}>
        <LessonsInfo
          mainDescription={mainDescription}
          availability={availability}
          contact={contact}
          location={location}
          reviewLink={reviewLink}
          phoneNumber={phoneNumber}
        />
      </Banner>
    </React.Fragment>
  );
};

Rates.propTypes = {
  location: PropTypes.string.isRequired,
  currentRoute: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  availability: PropTypes.string.isRequired,
  mainDescription: PropTypes.string.isRequired,
  mainPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  reviewLink: PropTypes.string,
  phoneNumber: PropTypes.string,
};
Rates.defaultProps = {
  reviewLink: null,
  phoneNumber: null,
};

const RatesWithData = ({ location }) => (
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
        currentRoute={location.pathname}
        location={data.contentfulLessons.location}
        contact={data.contentfulLessons.contact}
        reviewLink={data.contentfulLessons.reviewLink}
        availability={data.contentfulLessons.availability.childMarkdownRemark.html}
        mainDescription={data.contentfulLessons.mainDescription.childMarkdownRemark.html}
        mainPhoto={data.contentfulLessons.mainPhoto}
      />
    )}
  />
);

RatesWithData.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default RatesWithData;
