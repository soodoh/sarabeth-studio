import React, { ReactElement } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Fab from '@material-ui/core/Fab';
import Instagram from 'mdi-material-ui/Instagram';
import Facebook from 'mdi-material-ui/Facebook';
import Soundcloud from 'mdi-material-ui/Soundcloud';
import Youtube from 'mdi-material-ui/Youtube';
import Linkedin from 'mdi-material-ui/Linkedin';
import Twitter from 'mdi-material-ui/Twitter';
import Email from 'mdi-material-ui/Email';
import { SocialMedia } from '../../types';

function renderIcon(icon: string) {
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

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

interface SocialMediaProps {
  data: SocialMedia[];
}

const SocialMediaContainer = (props: SocialMediaProps): ReactElement => {
  const { data } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {data.map(({ source, id, link }) => (
        <a key={id} href={source === 'Email' ? `mailto:${link}` : link} style={{ color: 'inherit' }}>
          <Fab size="small" aria-label={source} className={classes.button}>
            {renderIcon(source)}
          </Fab>
        </a>
      ))}
    </div>
  );
};

const SocialWithData = (): ReactElement => (
  <StaticQuery
    query={graphql`
      query SocialMediaQuery {
        allContentfulSocialMedia(sort: { fields: [order], order: ASC }) {
          edges {
            node {
              id
              source
              link
            }
          }
        }
      }
    `}
    render={data => <SocialMediaContainer data={data.allContentfulSocialMedia.edges.map((item: { node: SocialMedia }) => item.node)} />}
  />
);
export default SocialWithData;
