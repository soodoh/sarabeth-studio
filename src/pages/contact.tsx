import React, { ReactElement, useState } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Validator from 'email-validator';
import Fade from 'react-reveal/Fade';
import Metadata from '../components/Layout/Metadata';
import Title from '../components/common/Title';
import MessageStatus from '../components/common/MessageStatus';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    padding: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      padding: `${theme.spacing(4)}px 20vw`,
    },
  },
  button: {
    marginTop: theme.spacing(2),
  },
  loading: {
    margin: theme.spacing(4),
  },
  form: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  halfWidth: {
    width: '50%',

    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  textInput: {
    margin: theme.spacing(2, 0),
  },
  notchedOutline: {
    borderColor: `${theme.palette.primary.contrastText}!important`,
  },
}));

interface ContactProps {
  submitUrl: string;
}

const Contact = (props: ContactProps): ReactElement => {
  const { submitUrl } = props;
  const classes = useStyles(props);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [submitSuccess, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const hasErrors = !name || !email || !Validator.validate(email) || !subject || !message;

  const submit = () => {
    setShowErrors(true);
    if (hasErrors) return;
    setLoading(true);

    const data = {
      name,
      email,
      subject,
      message,
    };
    axios
      .post(submitUrl, JSON.stringify(data))
      .then(res => {
        setLoading(false);
        setSuccess(res.status === 200);
        setMessageOpen(true);
        setShowErrors(false);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err);
        setLoading(false);
        setSuccess(false);
        setMessageOpen(true);
      });
  };

  const outlineClasses = { notchedOutline: classes.notchedOutline };
  const transitionDelay = 200;
  return (
    <>
      <Metadata
        title="Contact Sarabeth"
        description="Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons."
      />

      <div className={classes.container}>
        <Fade top>
          <Title>Contact Sarabeth</Title>
        </Fade>

        <div className={classes.form}>
          <Fade opposite delay={transitionDelay}>
            <TextField
              fullWidth
              variant="outlined"
              className={`${classes.halfWidth} ${classes.textInput}`}
              InputProps={{ classes: outlineClasses }}
              margin="normal"
              label="Name"
              value={name}
              onChange={(event: any) => setName(event.target.value)}
              error={showErrors && !name}
              helperText={showErrors && 'Required field'}
            />
          </Fade>
          <Fade opposite delay={transitionDelay * 2}>
            <TextField
              fullWidth
              variant="outlined"
              className={`${classes.halfWidth} ${classes.textInput}`}
              InputProps={{ classes: outlineClasses }}
              margin="normal"
              label="Email"
              value={email}
              onChange={(event: any) => setEmail(event.target.value)}
              error={showErrors && (!email || !Validator.validate(email))}
              helperText={showErrors && 'Enter a valid email'}
            />
          </Fade>
          <Fade opposite delay={transitionDelay * 3}>
            <TextField
              fullWidth
              variant="outlined"
              className={classes.textInput}
              InputProps={{ classes: outlineClasses }}
              margin="normal"
              label="Subject"
              value={subject}
              onChange={(event: any) => setSubject(event.target.value)}
              error={showErrors && !subject}
              helperText={showErrors && 'Required field'}
            />
          </Fade>
          <Fade opposite delay={transitionDelay * 4}>
            <TextField
              fullWidth
              variant="outlined"
              className={classes.textInput}
              InputProps={{ classes: outlineClasses }}
              margin="normal"
              label="Message"
              value={message}
              onChange={(event: any) => setMessage(event.target.value)}
              error={showErrors && !message}
              helperText={showErrors && 'Required field'}
              rows={5}
              multiline
            />
          </Fade>
        </div>

        {loading ? (
          <CircularProgress color="secondary" className={classes.loading} />
        ) : (
          <Fade left opposite delay={1000}>
            <Button variant="outlined" className={classes.button} onClick={submit}>
              Submit
            </Button>
          </Fade>
        )}

        <MessageStatus open={messageOpen} onClose={() => setMessageOpen(false)} success={submitSuccess} />
      </div>
    </>
  );
};

const ContactWithData = (): ReactElement => (
  <StaticQuery
    query={graphql`
      query ContactQuery {
        contentfulContact {
          awsUrl
        }
      }
    `}
    render={data => <Contact submitUrl={data.contentfulContact.awsUrl} />}
  />
);
export default ContactWithData;
