import { StepsBase } from './steps';
import { StepsState } from './state';
import { StepsAPI } from './api';

export interface StepsComputedProps<StepsHash extends StepsBase> {
  readonly initialValues: StepsHash;
  readonly initialActive: keyof StepsHash;
}

export type StepsChildrenProps<StepsHash extends StepsBase> = StepsState<StepsHash> &
  StepsAPI<StepsHash> &
  StepsComputedProps<StepsHash>;
