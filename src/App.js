// https://github.com/bmvantunes/youtube-2020-june-multi-step-form-formik

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { Formik, Field, Form } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { mixed, object, number } from 'yup';

const sleep = (time) => new Promise((acc) => setTimeout(acc, time));

export function FormikStep({ children }) {
  return <>{children}</>;
}
export function FormikStepper({ children, ...props }) {
  const childrenArray = React.Children.toArray(children);
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const currentChild = childrenArray[step];

  const isLastStep = () => {
    return step === childrenArray.length - 1;
  };
  return (
    <Formik
      {...props}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setComplete(true);
        } else {
          setStep((s) => s + 1);
        }
      }}
      validationSchema={currentChild.props.validationSchema}
    >
      {({ isSubmitting }) => (
        <Form>
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                onClick={() => {
                  setStep(index);
                }}
                completed={step > index || complete}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {currentChild}
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant='contained'
                color='primary'
                disabled={!(step > 0) || isSubmitting}
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            </Grid>

            <Grid item>
              <Button
                startIcon={isSubmitting && <CircularProgress size='1rem' />}
                disabled={isSubmitting}
                variant='contained'
                color='primary'
                type='submit'
              >
                {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

function App() {
  return (
    <Card>
      <CardContent>
        <FormikStepper
          initialValues={{
            firstName: '',
            lastName: '',
            millionaire: false,
            money: 0,
            description: '',
          }}
          onSubmit={async (value) => {
            await sleep(2000);
            console.log('value', value);
          }}
        >
          <FormikStep label='Personal Data'>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name='firstName'
                component={TextField}
                label='First Name'
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name='lastName'
                component={TextField}
                label='Last Name'
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                type='checkbox'
                name='millionaire'
                component={CheckboxWithLabel}
                Label={{ label: 'I am a millionaire' }}
              />
            </Box>
          </FormikStep>
          <FormikStep
            label='Bank Accounts'
            validationSchema={object({
              money: mixed().when('millionaire', {
                is: true,
                then: number()
                  .required()
                  .min(
                    1_000_000,
                    'Because you said you are millionaire. You need to have 1 million.'
                  ),
                otherwise: number().required(),
              }),
            })}
          >
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name='money'
                component={TextField}
                label='All the money I have'
                type='number'
              />
            </Box>
          </FormikStep>
          <FormikStep label='More info'>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name='desciption'
                component={TextField}
                label='Description'
              />
            </Box>
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export default App;
