import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import AudioPlayer from './AudioPlayer';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  metadata: {
    display: 'flex',
  },
  title: {
    color: theme.palette.secondary.main,
  },
  subtitle: {
    color: theme.palette.primary.contrastText,
    marginLeft: theme.spacing(2),
  },
}));

interface SongProps {
  title: string;
  subtitle: string;
  url: string;
}

const SongEntry = (props: SongProps): ReactElement => {
  const { title, subtitle, url } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <div className={classes.metadata}>
        <Typography variant="body2" className={classes.title}>
          {title}
        </Typography>

        <Typography variant="body2" className={classes.subtitle}>
          {subtitle}
        </Typography>
      </div>

      <AudioPlayer title={title} url={url} />
    </div>
  );
};

export default SongEntry;
