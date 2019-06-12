import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import PhilosophySection from '../../components/Lessons/Philosophy';

const Philosophy = (props) => {
  const {
    aboutDescription, mainPhoto, reviewLink, currentRoute,
  } = props;

  return (
    <React.Fragment>
      <Metadata
        title="Singing Lessons | Piano Lessons Los Angeles"
        description="Offering the very best singing and piano lessons in Los Angeles. Refine your voice, sing with ease, and perfect your piano skills. Book your lesson now!"
        keywords={[
          'singing lessons los angeles',
          'piano lessons los angeles',
          'piano teacher los angeles',
        ]}
      />

      <Banner mainPhoto={mainPhoto} currentRoute={currentRoute}>
        <PhilosophySection
          aboutDescription={aboutDescription}
          reviewLink={reviewLink}
        />
      </Banner>
    </React.Fragment>
  );
};

Philosophy.propTypes = {
  reviewLink: PropTypes.string,
  currentRoute: PropTypes.string.isRequired,
  aboutDescription: PropTypes.string.isRequired,
  mainPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};
Philosophy.defaultProps = {
  reviewLink: null,
};

const PhilosophyWithData = ({ location }) => (
  <StaticQuery
    query={graphql`
      query LessonsQuery {
        contentfulLessons {
          reviewLink
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
        currentRoute={location.pathname}
        reviewLink={data.contentfulLessons.reviewLink}
        aboutDescription={data.contentfulLessons.aboutDescription.childMarkdownRemark.html}
        mainPhoto={data.contentfulLessons.mainPhoto}
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
