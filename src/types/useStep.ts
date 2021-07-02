import { StepsBase } from './steps';
import { StepsContext } from './context';
import { SetConfirmedStateParams } from './api';

export interface StepAPI<StepsHash extends StepsBase, StepValue> {
  initialValue: StepValue;
  initialActive: boolean;
  currentValue: StepValue;
  isActive: boolean;
  isConfirmed: boolean;
  isOpen: boolean;
  isFailed: boolean;
  isPending: boolean;
  isTouched: boolean;
  setValue: (value: StepValue) => void;
  setOpenStatus: (status: boolean) => void;
  setTouchedStatus: (status: boolean) => void;
  setActiveStatus: (status: boolean) => void;
  setConfirmedStatus: (params: SetConfirmedStateParams<StepsHash>) => void;
  setPendingStatus: (status: boolean) => void;
  setFailedStatus: (status: boolean) => void;
  detectChange: () => void;
  order?: number;
}

export interface UseStepResult<StepsHash extends StepsBase, StepValue> {
  step: StepAPI<StepsHash, StepValue>;
  stepsAPI: StepsContext<StepsHash>;
  rerenderStatus: number;
}
