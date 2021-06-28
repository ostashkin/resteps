import { UseStepResult } from './useStep';
import { StepsBase } from './steps';

export interface ConnectedStepProps {
  id: string;
  debug: boolean;
}

export interface StepComponentProps<StepsHash extends StepsBase, StepsValue = any>
  extends UseStepResult<StepsHash, StepsValue> {}
