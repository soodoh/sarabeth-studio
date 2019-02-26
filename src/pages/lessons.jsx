import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { StaticQuery, graphql } from 'gatsby';
import Divider from '@material-ui/core/Divider';
import Banner from '../components/Lessons/Banner';
import About from '../components/Lessons/About';
import LessonsInfo from '../components/Lessons/LessonsInfo';
import StudioInfo from '../components/Lessons/StudioInfo';
import Metadata from '../components/Layout/Metadata';

class LessonsCore extends React.Component {
  constructor(props) {
    super(props);

    this.aboutRef = React.createRef();
    this.infoRef = React.createRef();
  }

  render() {
    const {
      classes, location, contact, reviewLink, voiceLessons,
      pianoLessons, teachingResume, availability, mainDescription,
      aboutDescription, mainPhoto, aboutPhoto, photoGallery,
      voiceLessonsSvg, pianoLessonsSvg,
    } = this.props;

    return (
      <>
        <Metadata
          title="Sarabeth's Studio"
          description="Interested in private singing and piano lessons? As a UCLA Vocal Performance alumnus, Sarabeth is well-versed in many styles of singing and piano. View rates and info below."
        />

        <Banner
          aboutRef={this.aboutRef}
          infoRef={this.infoRef}
          mainPhoto={mainPhoto}
          voiceLessons={voiceLessons}
          pianoLessons={pianoLessons}
          voiceLessonsSvg={voiceLessonsSvg}
          pianoLessonsSvg={pianoLessonsSvg}
        />

        <div ref={this.aboutRef} />
        <About
          aboutPhoto={aboutPhoto}
          aboutDescription={aboutDescription}
        />

        <div ref={this.infoRef} />
        <LessonsInfo
          mainDescription={mainDescription}
          availability={availability}
          contact={contact}
          location={location}
          reviewLink={reviewLink}
        />

        <Divider className={classes.divider} />

        <StudioInfo
          teachingResume={teachingResume}
          photoGallery={photoGallery}
        />
      </>
    );
  }
}

LessonsCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
  voiceLessonsSvg: PropTypes.string.isRequired,
  voiceLessons: PropTypes.string.isRequired,
  pianoLessonsSvg: PropTypes.string.isRequired,
  pianoLessons: PropTypes.string.isRequired,
  teachingResume: PropTypes.string.isRequired,
  availability: PropTypes.string.isRequired,
  mainDescription: PropTypes.string.isRequired,
  aboutDescription: PropTypes.string.isRequired,
  mainPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  aboutPhoto: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  photoGallery: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  reviewLink: PropTypes.string,
};
LessonsCore.defaultProps = {
  reviewLink: null,
};

const styles = theme => ({
  divider: {
    margin: theme.spacing.unit * 2,
    backgroundColor: theme.palette.secondary.light,
  },
});

const Lessons = withStyles(styles)(LessonsCore);

export default () => (
  <StaticQuery
    query={graphql`
      query LessonsQuery {
        contentfulLessons {
          location
          contact
          reviewLink
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
          aboutDescription {
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
          mainPhoto {
            title
            description
            fluid(maxWidth: 1280) {
              ...GatsbyContentfulFluid_withWebp
            }
          }
          aboutPhoto {
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
      <Lessons
        location={data.contentfulLessons.location}
        contact={data.contentfulLessons.contact}
        reviewLink={data.contentfulLessons.reviewLink}
        voiceLessonsSvg={data.contentfulLessons.voiceLessonsImage.file.url}
        voiceLessons={data.contentfulLessons.voiceLessons.childMarkdownRemark.html}
        pianoLessonsSvg={data.contentfulLessons.pianoLessonsImage.file.url}
        pianoLessons={data.contentfulLessons.pianoLessons.childMarkdownRemark.html}
        teachingResume={data.contentfulLessons.teachingResume.childMarkdownRemark.html}
        availability={data.contentfulLessons.availability.childMarkdownRemark.html}
        mainDescription={data.contentfulLessons.mainDescription.childMarkdownRemark.html}
        aboutDescription={data.contentfulLessons.aboutDescription.childMarkdownRemark.html}
        mainPhoto={data.contentfulLessons.mainPhoto}
        aboutPhoto={data.contentfulLessons.aboutPhoto}
        photoGallery={data.contentfulLessons.photoGallery}
      />
    )}
  />
);
