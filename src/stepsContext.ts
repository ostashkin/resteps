import React from 'react';
import { StepsContext } from './types/context';
import { StepsBase } from './types/steps';

const stepsContext = React.createContext<StepsContext<any>>(undefined as any);

const { Provider: StepsProvider } = stepsContext;
const { Consumer: StepsConsumer } = stepsContext;

const useStepsContext = <StepsHash extends StepsBase = StepsBase>(): StepsContext<StepsHash> =>
  React.useContext(stepsContext) as StepsContext<StepsHash>;

export { StepsProvider, StepsConsumer, useStepsContext };
