import { StepsBase } from './steps';

export type StepsInfo<StepsHash extends StepsBase, InfoDataType = any> = {
  [StepID in keyof StepsHash]?: InfoDataType;
};

export type StepsBooleanInfo<StepsHash extends StepsBase> = StepsInfo<StepsHash, boolean>;
