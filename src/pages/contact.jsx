import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Validator from 'email-validator';
import Metadata from '../components/Layout/Metadata';
import Title from '../components/common/Title';
import Form from '../components/Contact/Form';
import MessageStatus from '../components/Contact/MessageStatus';

class ContactCore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      subject: '',
      message: '',
      validations: {},
      messageOpen: false,
      submitSuccess: false,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.messageClose = this.messageClose.bind(this);
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
  }

  validate(key, newValue) {
    const {
      name, email, subject, message, validations,
    } = this.state;
    const newValidations = { ...validations };

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
  }

  submit() {
    const validations = this.validate();
    const {
      name, email, subject, message,
    } = this.state;
    const { submitUrl } = this.props;

    if (validations.name || validations.email || validations.subject || validations.message) {
      this.setState({ validations });
      return;
    }
    this.setState({ loading: true });

    const data = {
      name,
      email,
      subject,
      message,
    };
    axios.post(submitUrl, JSON.stringify(data)).then((res) => {
      this.setState({
        loading: false,
        submitSuccess: res.status === 200,
        messageOpen: true,
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      this.setState({
        loading: false,
        submitSuccess: false,
        messageOpen: true,
      });
    });
  }

  handleChange(key) {
    return (event) => {
      this.setState({
        [key]: event.target.value,
        validations: this.validate(key, event.target.value),
      });
    };
  }

  messageClose(event, reason) {
    if (reason === 'clickaway') return;

    this.setState({ messageOpen: false });
  }

  render() {
    const { classes } = this.props;
    const {
      name, email, subject, message, validations,
      loading, messageOpen, submitSuccess,
    } = this.state;

    const values = {
      name, email, subject, message,
    };

    return (
      <React.Fragment>
        <Metadata
          title="Contact Sarabeth"
          description="Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons."
        />

        <Grid container spacing={8} className={classes.container}>
          <Grid item xs={12}>
            <Title>Contact Sarabeth</Title>
          </Grid>

          <Form
            values={values}
            validations={validations}
            onChange={this.handleChange}
          />

          <Grid item xs={12}>
            {loading
              ? <CircularProgress color="secondary" className={classes.loading} />
              : (
                <Button
                  variant="outlined"
                  className={classes.button}
                  onClick={this.submit}
                >
                Submit
                </Button>
              )
          }
          </Grid>

          <MessageStatus
            open={messageOpen}
            onClose={this.messageClose}
            success={submitSuccess}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

ContactCore.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  submitUrl: PropTypes.string.isRequired,
};

const styles = theme => ({
  container: {
    width: '100%',
    padding: theme.spacing.unit * 4,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
  },
  loading: {
    margin: theme.spacing.unit * 4,
  },
});

const Contact = withStyles(styles)(ContactCore);

export default () => (
  <StaticQuery
    query={graphql`
      query ContactQuery {
        contentfulContact{
          awsUrl
        }
      }
    `}
    render={data => (
      <Contact submitUrl={data.contentfulContact.awsUrl} />
    )}
  />
);
