import React from 'react';
import { StepsContext } from './types/context';

const stepsContext = React.createContext<StepsContext<any>>(undefined as any);

const { Provider: StepsProvider } = stepsContext;
const { Consumer: StepsConsumer } = stepsContext;

const useStepsContext = () => React.useContext(stepsContext);

export { StepsProvider, StepsConsumer, useStepsContext };
