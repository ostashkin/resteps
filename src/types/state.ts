import { StepsBase } from './steps';
import { StepsBooleanInfo } from './info';

export interface StepsState<StepsHash extends StepsBase> {
  values: StepsHash;
  activeStep: keyof StepsHash;
  confirmedSteps: StepsBooleanInfo<StepsHash>;
  touchedSteps: StepsBooleanInfo<StepsHash>;
  failedSteps: StepsBooleanInfo<StepsHash>;
  openSteps: StepsBooleanInfo<StepsHash>;
  pendingSteps: StepsBooleanInfo<StepsHash>;
}
