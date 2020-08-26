import React, { ReactElement, useState } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Validator from 'email-validator';
import Fade from 'react-reveal/Fade';
import Metadata from '../components/Layout/Metadata';
import Title from '../components/common/Title';
import Form from '../components/Contact/Form';
import MessageStatus from '../components/Contact/MessageStatus';

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
  const [validations, setValidations] = useState({});
  const [messageOpen, setMessageOpen] = useState(false);
  const [submitSuccess, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (key?: string, newValue?: string) => {
    const newValidations: any = { ...validations };

    if (!key) {
      // If not specified, run all validations
      newValidations.name = !name && 'Required Field';
      newValidations.email = !Validator.validate(email) && 'Enter a valid Email';
      newValidations.subject = !subject && 'Required Field';
      newValidations.message = !message && 'Required Field';
    } else if (key === 'email') {
      newValidations.email = !Validator.validate(newValue) && 'Enter a valid Email';
    } else {
      newValidations[key] = !newValue && 'Required Field';
    }

    return newValidations;
  };

  const submit = () => {
    const allValidations = validate();

    if (!Object.values(allValidations).length || Object.values(allValidations).some(val => !!val)) {
      setValidations(allValidations);
      return;
    }
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

  const handleChange = (key: string) => (event: InputEvent) => {
    const newValidation = validate(key, event.target.value);
    setValidations(newValidation);

    switch (key) {
      case 'name':
        setName(event.target.value);
        break;
      case 'email':
        setEmail(event.target.value);
        break;
      case 'subject':
        setSubject(event.target.value);
        break;
      case 'message':
        setMessage(event.target.value);
        break;
      default:
        break;
    }
  };

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

        <Form
          values={{
            name,
            email,
            subject,
            message,
          }}
          validations={validations}
          onChange={handleChange}
        />

        {loading ? (
          <CircularProgress color="secondary" className={classes.loading} />
        ) : (
          <Fade left opposite delay={1000}>
            <Button variant="outlined" className={classes.button} onClick={submit}>
              Submit
            </Button>
          </Fade>
        )}

        <MessageStatus
          open={messageOpen}
          onClose={(_event, reason) => {
            if (reason === 'clickaway') return;
            setMessageOpen(false);
          }}
          success={submitSuccess}
        />
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
