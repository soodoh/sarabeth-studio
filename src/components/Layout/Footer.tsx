import React, { ReactElement } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import SocialMedia from '../common/SocialMedia';

const useStyles = makeStyles(theme => ({
  footer: {
    flexShrink: 0,
    width: '100%',
    height: 'auto',
    zIndex: 1,
    color: theme.palette.primary.contrastText,
  },
  content: {
    display: 'flex',
    height: '100%',
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 2),

    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
    },
  },
  leftGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
}));

interface FooterProps {
  geoLocation: string;
}

const Footer = (props: FooterProps): ReactElement => {
  const { geoLocation } = props;
  const classes = useStyles(props);

  return (
    <footer className={classes.footer}>
      <section className={classes.content}>
        <div className={classes.leftGroup}>
          {geoLocation && (
            <Typography variant="caption" color="inherit">
              {geoLocation}
            </Typography>
          )}
          <Typography variant="caption" color="inherit">
            Copyright &copy; {new Date().getFullYear()} Sarabeth Belon
          </Typography>
        </div>

        <div>
          <SocialMedia />
        </div>

        <div className={classes.rightGroup}>
          <Typography variant="caption" color="inherit">
            Designed by Carolyn DiLoreto
          </Typography>
          <Typography variant="caption" color="inherit">
            Developed by Paul DiLoreto
          </Typography>
        </div>
      </section>
    </footer>
  );
};

const FooterWithData = (): ReactElement => (
  <StaticQuery
    query={graphql`
      query FooterQuery {
        contentfulAbout {
          location
        }
      }
    `}
    render={data => <Footer geoLocation={data.contentfulAbout.location} />}
  />
);
export default FooterWithData;
