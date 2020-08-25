import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const Metadata = props => {
  const { title, description, robots, keywords } = props;

  return (
    <Helmet>
      <title>{title}</title>

      {description && <meta name="description" content={description} />}
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(',')} />}
      <meta name="GOOGLEBOT" content="index, follow" />
      <meta name="ROBOTS" content="index, follow" />
      <meta name="geo.region" content="US-CA" />
      <meta name="geo.placename" content="Montebello" />
      <meta name="google-site-verification" content="recDsrmbMWYOcfMC0vEE0asXttST_2d-4VZs1EVtSps" />

      <meta name="robots" content={robots} />
    </Helmet>
  );
};

Metadata.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  robots: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
};
Metadata.defaultProps = {
  description: null,
  keywords: null,
  robots: 'index, follow',
};

export default Metadata;
