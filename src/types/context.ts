import { StepsBase } from './steps';
import { StepsChildrenProps } from './props';

export interface StepsContext<StepsHash extends StepsBase> extends StepsChildrenProps<StepsHash> {
  calculateStepOrder: (stepID: keyof StepsHash) => void;
}
