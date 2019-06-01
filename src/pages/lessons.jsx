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
      voiceLessonsSvg, pianoLessonsSvg, phoneNumber,
    } = this.props;

    return (
      <>
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
          phoneNumber={phoneNumber}
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
  phoneNumber: PropTypes.string,
};
LessonsCore.defaultProps = {
  reviewLink: null,
  phoneNumber: null,
};

const styles = theme => ({
  divider: {
    margin: `0 ${theme.spacing.unit * 6}px`,
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
          phoneNumber
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
        phoneNumber={data.contentfulLessons.phoneNumber}
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
