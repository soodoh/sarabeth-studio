import React from 'react';

interface Props {
  title: string;
  description?: string;
  keywords?: string[];
  robots?: string;
}

const Metadata = (props: Props) => {
  const { title, description, robots, keywords } = props;

  return (
    <>
      <title>{title}</title>

      {description && <meta name="description" content={description} />}
      {!!keywords?.length && <meta name="keywords" content={keywords.join(',')} />}
      <meta name="GOOGLEBOT" content="index, follow" />
      <meta name="ROBOTS" content="index, follow" />
      <meta name="geo.region" content="US-CA" />
      <meta name="geo.placename" content="Montebello" />
      <meta name="google-site-verification" content="recDsrmbMWYOcfMC0vEE0asXttST_2d-4VZs1EVtSps" />

      <meta name="robots" content={robots || 'index, follow'} />
    </>
  );
};

export default Metadata;
