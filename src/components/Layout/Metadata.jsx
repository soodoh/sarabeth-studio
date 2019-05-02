import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const Metadata = (props) => {
  const {
    title, description, robots, keywords,
  } = props;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="google-site-verification" content="recDsrmbMWYOcfMC0vEE0asXttST_2d-4VZs1EVtSps" />
      <meta name="keywords" content={keywords.join(',')} />

      {description
        && <meta name="description" content={description} />
      }

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
  robots: 'index, follow',
  keywords: [],
};

export default Metadata;
