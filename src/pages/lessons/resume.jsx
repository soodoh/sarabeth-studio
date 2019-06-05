import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import StudioInfo from '../../components/Lessons/StudioInfo';

const TeachingResume = (props) => {
  const {
    currentRoute, mainPhoto, reviewLink,
    teachingResume, photoGallery,
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
        <StudioInfo
          reviewLink={reviewLink}
          teachingResume={teachingResume}
          photoGallery={photoGallery}
        />
      </Banner>
    </React.Fragment>
  );
};

TeachingResume.propTypes = {
  currentRoute: PropTypes.string.isRequired,
  mainPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  reviewLink: PropTypes.string,
  teachingResume: PropTypes.string.isRequired,
  photoGallery: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
};
TeachingResume.defaultProps = {
  reviewLink: null,
};

const TeachingResumeWithData = ({ location }) => (
  <StaticQuery
    query={graphql`
      query TeachingResumeQuery {
        contentfulLessons {
          reviewLink
          teachingResume {
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
          photoGallery {
            title
            description
            fullSize: fluid(maxWidth: 1280) {
              ...GatsbyContentfulFluid_withWebp
            }
            thumbnail: fluid(maxWidth: 600) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
        }
      }
    `}
    render={data => (
      <TeachingResume
        currentRoute={location.pathname}
        reviewLink={data.contentfulLessons.reviewLink}
        teachingResume={data.contentfulLessons.teachingResume.childMarkdownRemark.html}
        mainPhoto={data.contentfulLessons.mainPhoto}
        photoGallery={data.contentfulLessons.photoGallery}
      />
    )}
  />
);

TeachingResumeWithData.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default TeachingResumeWithData;
