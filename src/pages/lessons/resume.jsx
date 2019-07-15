import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import StudioInfo from '../../components/Lessons/StudioInfo';

const TeachingResume = (props) => {
  const {
    contact,
    currentRoute,
    mainLogo,
    mainPhoto,
    phoneNumber,
    photoGallery,
    reviewLink,
    teachingResume,
  } = props;

  return (
    <React.Fragment>
      <Metadata
        title="Singing Lessons | Piano Lessons Los Angeles"
        description="Offering the very best singing and piano lessons in Los Angeles. Refine your voice, sing with ease, and perfect your piano skills. Book your lesson now!"
        keywords={[
          'voice lessons los angeles',
          'singing coach los angeles',
          'piano teacher los angeles',
        ]}
      />

      <Banner
        currentRoute={currentRoute}
        mainLogo={mainLogo}
        mainPhoto={mainPhoto}
      >
        <StudioInfo
          contact={contact}
          phoneNumber={phoneNumber}
          photoGallery={photoGallery}
          reviewLink={reviewLink}
          teachingResume={teachingResume}
        />
      </Banner>
    </React.Fragment>
  );
};

TeachingResume.propTypes = {
  contact: PropTypes.string.isRequired,
  currentRoute: PropTypes.string.isRequired,
  mainLogo: PropTypes.string,
  mainPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  phoneNumber: PropTypes.string,
  photoGallery: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  reviewLink: PropTypes.string,
  teachingResume: PropTypes.string.isRequired,
};
TeachingResume.defaultProps = {
  mainLogo: null,
  phoneNumber: null,
  reviewLink: null,
};

const TeachingResumeWithData = ({ location }) => (
  <StaticQuery
    query={graphql`
      query TeachingResumeQuery {
        contentfulLessons {
          reviewLink
          contact
          phoneNumber
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
          mainLogo {
            file {
              url
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
        contact={data.contentfulLessons.contact}
        currentRoute={location.pathname}
        mainLogo={data.contentfulLessons.mainLogo.file.url}
        mainPhoto={data.contentfulLessons.mainPhoto}
        phoneNumber={data.contentfulLessons.phoneNumber}
        photoGallery={data.contentfulLessons.photoGallery}
        reviewLink={data.contentfulLessons.reviewLink}
        teachingResume={data.contentfulLessons.teachingResume.childMarkdownRemark.html}
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
