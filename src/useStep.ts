import { useMemo } from 'react';
import { StepsBase } from './types/steps';
import { useStepsContext } from './stepsContext';
import { UseStepResult } from './types/useStep';

function useStep<StepsHash extends StepsBase, StepID extends keyof StepsHash>(
  stepID: StepID
): UseStepResult<StepsHash[StepID]> {
  const {
    // initial values
    initialValues,
    initialActive,
    // current state
    values,
    activeStep,
    confirmedSteps,
    openSteps,
    failedSteps,
    pendingSteps,
    touchedSteps,
    // api
    setValues,
    setOpen,
    setTouched,
    setActive,
    setConfirmed,
    setFailed,
    setPending,
  } = useStepsContext<StepsHash>();

  const stepInitialValues = initialValues[stepID];
  const stepInitialActive = initialActive === stepID;

  const currentStepValues = values[stepID];
  const isStepActive = activeStep === stepID;
  const isStepConfirmed: boolean = confirmedSteps[stepID] || false;
  const isStepOpen: boolean = openSteps[stepID] || false;
  const isStepFailed: boolean = failedSteps[stepID] || false;
  const isStepPending: boolean = pendingSteps[stepID] || false;
  const isStepTouched: boolean = touchedSteps[stepID] || false;

  const setStepValues = (stepValues: StepsHash[StepID]) => setValues(stepID, stepValues);

  const setStepOpenStatus = (status: boolean) => setOpen(stepID, status);
  const setStepTouchedStatus = (status: boolean) => setTouched(stepID, status);
  const setStepActiveStatus = (status: boolean) => setActive(stepID, status);
  const setStepConfirmedStatus = (status: boolean) => setConfirmed(stepID, status);
  const setStepPendingStatus = (status: boolean) => setPending(stepID, status);
  const setStepFailedStatus = (status: boolean) => setFailed(stepID, status);

  return useMemo<UseStepResult<StepsHash[StepID]>>(
    () => ({
      initialValue: stepInitialValues,
      initialActive: stepInitialActive,
      currentValue: currentStepValues,
      isActive: isStepActive,
      isConfirmed: isStepConfirmed,
      isOpen: isStepOpen,
      isFailed: isStepFailed,
      isPending: isStepPending,
      isTouched: isStepTouched,
      setValue: setStepValues,
      setOpenStatus: setStepOpenStatus,
      setTouchedStatus: setStepTouchedStatus,
      setActiveStatus: setStepActiveStatus,
      setConfirmedStatus: setStepConfirmedStatus,
      setPendingStatus: setStepPendingStatus,
      setFailedStatus: setStepFailedStatus,
    }),
    []
  );
}

export { useStep };
