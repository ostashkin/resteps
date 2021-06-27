import { StepsBase } from './steps';
import { StepsContext } from './context';

export interface StepAPI<StepValue> {
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
  setConfirmedStatus: (status: boolean) => void;
  setPendingStatus: (status: boolean) => void;
  setFailedStatus: (status: boolean) => void;
  detectChange: () => void;
  order?: number;
}

export interface UseStepResult<StepsHash extends StepsBase, StepValue> {
  step: StepAPI<StepValue>;
  stepsAPI: StepsContext<StepsHash>;
  rerenderStatus: number;
}
