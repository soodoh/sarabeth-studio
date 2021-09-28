import React, { ReactElement } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Metadata from '../../components/Layout/Metadata';
import Banner from '../../components/Lessons/Banner';
import StudioInfo from '../../components/Lessons/StudioInfo';
import { LocationProps, Photo } from '../../types';

interface ResumeProps {
  contact: string;
  currentRoute: string;
  mainLogo: string;
  mainPhoto: Photo;
  phoneNumber: string;
  photoGallery: Photo[];
  reviewLink: string;
  teachingResume: string;
}

const TeachingResume = (props: ResumeProps): ReactElement => {
  const { contact, currentRoute, mainLogo, mainPhoto, phoneNumber, photoGallery, reviewLink, teachingResume } = props;

  return (
    <>
      <Metadata
        title="Singing Lessons | Piano Lessons Los Angeles"
        description="Offering the very best singing and piano lessons in Los Angeles. Refine your voice, sing with ease, and perfect your piano skills. Book your lesson now!"
        keywords={['voice lessons los angeles', 'singing coach los angeles', 'piano teacher los angeles']}
      />

      <Banner currentRoute={currentRoute} mainLogo={mainLogo} mainPhoto={mainPhoto}>
        <StudioInfo
          contact={contact}
          phoneNumber={phoneNumber}
          photoGallery={photoGallery}
          reviewLink={reviewLink}
          teachingResume={teachingResume}
        />
      </Banner>
    </>
  );
};

const TeachingResumeWithData = (props: LocationProps): ReactElement => (
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
        currentRoute={props.location.pathname}
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

export default TeachingResumeWithData;
