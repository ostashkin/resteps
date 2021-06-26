export interface UseStepResult<StepValue> {
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
}
