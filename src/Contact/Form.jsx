import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const Form = (props) => {
	const { onChange, values, validations } = props;

	return (
		<Grid container spacing={8}>
			<Grid item xs={12}>
				<Grid item xs={12} sm={6}>
					<TextField
            fullWidth
            margin="normal"
            label="Name"
            value={values.name}
            onChange={onChange('name')}
            error={!!validations.name}
            helperText={validations.name}
					/>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={values.email}
            onChange={onChange('email')}
            error={!!validations.email}
            helperText={validations.email}
					/>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<TextField
          fullWidth
          margin="normal"
          label="Subject"
          value={values.subject}
          onChange={onChange('subject')}
          error={!!validations.subject}
          helperText={validations.subject}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
          fullWidth
          multiline
          margin="normal"
          label="Message"
          value={values.message}
          onChange={onChange('message')}
          error={!!validations.message}
          helperText={validations.message}
				/>
			</Grid>
		</Grid>
	);
};

export default Form;
