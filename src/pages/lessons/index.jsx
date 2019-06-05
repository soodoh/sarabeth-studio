import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import About from '../../components/Lessons/About';

const Lessons = (props) => {
  const {
    currentRoute, voiceLessons, pianoLessons, reviewLink,
    mainPhoto, voiceLessonsSvg, pianoLessonsSvg,
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
        <About
          voiceLessons={voiceLessons}
          pianoLessons={pianoLessons}
          voiceLessonsSvg={voiceLessonsSvg}
          pianoLessonsSvg={pianoLessonsSvg}
          reviewLink={reviewLink}
        />
      </Banner>
    </React.Fragment>
  );
};

Lessons.propTypes = {
  currentRoute: PropTypes.string.isRequired,
  voiceLessonsSvg: PropTypes.string.isRequired,
  voiceLessons: PropTypes.string.isRequired,
  pianoLessonsSvg: PropTypes.string.isRequired,
  pianoLessons: PropTypes.string.isRequired,
  mainPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  reviewLink: PropTypes.string,
};
Lessons.defaultProps = {
  reviewLink: null,
};

const LessonsWithData = ({ location }) => (
  <StaticQuery
    query={graphql`
      query AboutLessonsQuery {
        contentfulLessons {
          reviewLink
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
        currentRoute={location.pathname}
        reviewLink={data.contentfulLessons.reviewLink}
        voiceLessonsSvg={data.contentfulLessons.voiceLessonsImage.file.url}
        voiceLessons={data.contentfulLessons.voiceLessons.childMarkdownRemark.html}
        pianoLessonsSvg={data.contentfulLessons.pianoLessonsImage.file.url}
        pianoLessons={data.contentfulLessons.pianoLessons.childMarkdownRemark.html}
        mainPhoto={data.contentfulLessons.mainPhoto}
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
