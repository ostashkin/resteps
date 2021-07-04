import React from 'react';
import { StepsBase } from './steps';
import { StepsBooleanInfo } from './info';
import { StepsChildrenProps } from './props';

export interface ConfirmationValues<StepsHash extends StepsBase> {
  values: StepsHash;
  activeStep: keyof StepsHash;
  openedSteps: StepsBooleanInfo<StepsHash>;
  touchedSteps: StepsBooleanInfo<StepsHash>;
  confirmedSteps: StepsBooleanInfo<StepsHash>;
  failedSteps: StepsBooleanInfo<StepsHash>;
  visitedSteps: StepsBooleanInfo<StepsHash>;
}

export interface OnStepConfirmed<StepsHash extends StepsBase> {
  (steps: ConfirmationValues<StepsHash>): void;
}

export interface StepsConfig<StepsHash extends StepsBase> {
  children: (args: StepsChildrenProps<StepsHash>) => React.ReactNode;
  initialValues: StepsHash;
  initialActive: keyof StepsHash;
  initialOpen?: StepsBooleanInfo<StepsHash>;
  initialTouched?: StepsBooleanInfo<StepsHash>;
  initialPending?: StepsBooleanInfo<StepsHash>;
  initialConfirmed?: StepsBooleanInfo<StepsHash>;
  initialFailed?: StepsBooleanInfo<StepsHash>;
  onStepConfirmed?: OnStepConfirmed<StepsHash>;
}
