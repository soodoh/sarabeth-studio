import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import About from '../../components/Lessons/About';

const Lessons = (props) => {
  const {
    contact,
    currentRoute,
    mainPhoto,
    phoneNumber,
    pianoLessons,
    pianoLessonsSvg,
    reviewLink,
    voiceLessons,
    voiceLessonsSvg,
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

      <Banner mainPhoto={mainPhoto} currentRoute={currentRoute}>
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
    </React.Fragment>
  );
};

Lessons.propTypes = {
  contact: PropTypes.string.isRequired,
  currentRoute: PropTypes.string.isRequired,
  mainPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  phoneNumber: PropTypes.string,
  pianoLessons: PropTypes.string.isRequired,
  pianoLessonsSvg: PropTypes.string.isRequired,
  reviewLink: PropTypes.string,
  voiceLessons: PropTypes.string.isRequired,
  voiceLessonsSvg: PropTypes.string.isRequired,
};
Lessons.defaultProps = {
  phoneNumber: null,
  reviewLink: null,
};

const LessonsWithData = ({ location }) => (
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
        currentRoute={location.pathname}
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
LessonsWithData.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default LessonsWithData;
