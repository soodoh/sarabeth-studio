import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import LessonsInfo from '../../components/Lessons/LessonsInfo';

const Rates = (props) => {
  const {
    availability,
    contact,
    currentRoute,
    location,
    mainDescription,
    mainLogo,
    mainPhoto,
    phoneNumber,
    reviewLink,
  } = props;

  return (
    <React.Fragment>
      <Metadata
        title="Singing Lessons | Piano Lessons Los Angeles"
        description="Offering the very best singing and piano lessons in Los Angeles. Refine your voice, sing with ease, and perfect your piano skills. Book your lesson now!"
        keywords={[
          'singing lessons los angeles',
          'piano lessons los angeles',
        ]}
      />

      <Banner
        currentRoute={currentRoute}
        mainLogo={mainLogo}
        mainPhoto={mainPhoto}
      >
        <LessonsInfo
          mainDescription={mainDescription}
          availability={availability}
          contact={contact}
          phoneNumber={phoneNumber}
          location={location}
          reviewLink={reviewLink}
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
  mainLogo: PropTypes.string,
};
Rates.defaultProps = {
  mainLogo: null,
  phoneNumber: null,
  reviewLink: null,
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
        currentRoute={location.pathname}
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

RatesWithData.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default RatesWithData;
