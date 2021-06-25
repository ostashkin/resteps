import { StepsBase } from './steps';
import { StepsChildrenProps } from './props';

export type StepsContext<StepsHash extends StepsBase> = StepsChildrenProps<StepsHash>;
