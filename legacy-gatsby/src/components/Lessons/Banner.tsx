import React, { ReactElement } from 'react';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Fade from 'react-reveal/Fade';
import { ReactSVG } from 'react-svg';
import Background from '../Layout/Background';
import Title from '../common/Title';
import { Photo } from '../../types';

const useStyles = makeStyles(theme => ({
  banner: {
    height: '50vh',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerPhoto: {
    filter: 'brightness(80%)',
  },
  bannerSvg: {
    width: 250,
    height: '100%',

    '& path': {
      fill: theme.palette.primary.main,
    },
  },
  bannerButton: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.light,
    border: 'none',
    margin: theme.spacing(2),
  },
  currentRoute: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      color: theme.palette.primary.contrastText,
    },
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}));

interface BannerProps {
  children: ReactElement;
  currentRoute: string;
  mainLogo: string;
  mainPhoto: Photo;
}

const Banner = (props: BannerProps): ReactElement => {
  const { children, currentRoute, mainLogo, mainPhoto } = props;
  const classes = useStyles(props);
  const routes = [
    { route: '/lessons', label: 'About' },
    { route: '/lessons/philosophy', label: 'Teaching Philosophy' },
    { route: '/lessons/rates', label: 'View Rates' },
    { route: '/lessons/resume', label: 'Teaching Resume' },
  ];
  const transitionDelay = 300;

  return (
    <>
      <div className={classes.banner}>
        <Background sizes={mainPhoto.fluid} className={classes.bannerPhoto} />
        <Title>
          {mainLogo ? (
            <ReactSVG
              src={mainLogo}
              beforeInjection={svg => {
                svg.classList.add(classes.bannerSvg);
              }}
            />
          ) : (
            "Sarabeth's Studio"
          )}
        </Title>
      </div>

      <div>
        <div className={classes.buttonGroup}>
          {routes.map(({ route, label }, index) => (
            <Fade top key={`${route}-${label}`} opposite delay={transitionDelay * (index + 1)}>
              <Button
                variant="outlined"
                className={`${classes.bannerButton} ${currentRoute == route ? classes.currentRoute : ''}`}
                component={Link}
                to={route}
              >
                {label}
              </Button>
            </Fade>
          ))}
        </div>

        {children}
      </div>
    </>
  );
};

export default Banner;
