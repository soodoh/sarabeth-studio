import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Instagram from 'mdi-material-ui/Instagram';
import Facebook from 'mdi-material-ui/Facebook';
import Soundcloud from 'mdi-material-ui/Soundcloud';
import Youtube from 'mdi-material-ui/Youtube';
import Linkedin from 'mdi-material-ui/Linkedin';
import Twitter from 'mdi-material-ui/Twitter';
import Email from 'mdi-material-ui/Email';

function renderIcon(icon) {
  switch (icon) {
    case 'Email':
      return <Email />;
    case 'Instagram':
      return <Instagram />;
    case 'Facebook':
      return <Facebook />;
    case 'Soundcloud':
      return <Soundcloud />;
    case 'Youtube':
      return <Youtube />;
    case 'Linkedin':
      return <Linkedin />;
    case 'Twitter':
      return <Twitter />;
    default:
      return <div />;
  }
}

const buttonStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const SocialMediaButton = (props) => {
  const { icon, url } = props;
  const classes = buttonStyles();

  return (
    <a href={icon === 'Email' ? `mailto:${url}` : url} style={{ color: 'inherit' }}>
      <Fab
        size="small"
        aria-label={icon}
        className={classes.button}
      >
        {renderIcon(icon)}
      </Fab>
    </a>
  );
};
SocialMediaButton.propTypes = {
  icon: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const coreStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

const SocialMedia = (props) => {
  const { data } = props;
  const classes = coreStyles();

  return (
    <div className={classes.container}>
      {data.map(item => (
        <SocialMediaButton
          key={uid(item)}
          url={item.link}
          icon={item.source}
        />
      ))}
    </div>
  );
};
SocialMedia.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default () => (
  <StaticQuery
    query={graphql`
      query SocialMediaQuery {
        allContentfulSocialMedia(sort: {fields: [order], order: ASC}) {
          edges{
            node{
              source,
              link
            }
          }
        }
      }
    `}
    render={data => (
      <SocialMedia
        data={
          data.allContentfulSocialMedia.edges.map(item => item.node)
        }
      />
    )}
  />
);
