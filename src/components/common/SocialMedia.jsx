import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';
import { withStyles } from '@material-ui/core/styles';
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

const ButtonBase = (props) => {
  const { classes, icon, url } = props;

  return (
    <a href={icon === 'Email' ? `mailto:${url}` : url} style={{ color: 'inherit' }}>
      <Fab size="small" className={classes.button}>
        {renderIcon(icon)}
      </Fab>
    </a>
  );
};
ButtonBase.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string,
  }).isRequired,
  icon: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

const buttonStyles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});
const SocialMediaButton = withStyles(buttonStyles)(ButtonBase);

const SocialMediaCore = (props) => {
  const { classes, data } = props;

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
SocialMediaCore.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
};

const SocialMedia = withStyles(styles)(SocialMediaCore);

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
