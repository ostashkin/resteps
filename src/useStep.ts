import React, { useEffect, useRef, useState } from 'react';
import { StepsBase } from './types/steps';
import { useStepsContext } from './stepsContext';
import { UseStepResult } from './types/useStep';
import { strictEqual } from './utils';

function useStep<StepsHash extends StepsBase, StepID extends keyof StepsHash>(
  stepID: StepID,
  hooks: (keyof StepsHash)[]
): UseStepResult<StepsHash, StepsHash[StepID]> {
  const context = useStepsContext<StepsHash>();

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
    // changed steps
    changedSteps,
  } = context;

  const stepInitialValues = initialValues[stepID];
  const stepInitialActive = initialActive === stepID;

  const currentStepValues = values[stepID];
  const isStepActive = activeStep === stepID;
  const isStepConfirmed: boolean = confirmedSteps[stepID] || false;
  const isStepOpen: boolean = openSteps[stepID] || false;
  const isStepFailed: boolean = failedSteps[stepID] || false;
  const isStepPending: boolean = pendingSteps[stepID] || false;
  const isStepTouched: boolean = touchedSteps[stepID] || false;

  const previousOpen = useRef(isStepOpen);
  const previousConfirmed = useRef(isStepConfirmed);
  const previousFailed = useRef(isStepFailed);
  const previousPending = useRef(isStepPending);
  const previousTouched = useRef(isStepTouched);

  const setStepValues = (stepValues: StepsHash[StepID]) => setValues(stepID, stepValues);

  const setStepOpenStatus = (status: boolean) => setOpen(stepID, status);
  const setStepTouchedStatus = (status: boolean) => setTouched(stepID, status);
  const setStepActiveStatus = (status: boolean) => setActive(stepID, status);
  const setStepConfirmedStatus = (status: boolean) => setConfirmed(stepID, status);
  const setStepPendingStatus = (status: boolean) => setPending(stepID, status);
  const setStepFailedStatus = (status: boolean) => setFailed(stepID, status);

  const [rerenderStatus, setRerenderState] = useState(0);
  const rerender = () => {
    setRerenderState((prevState) => prevState + 1);
  };

  // Rerender step only when its status has changed or
  // it hooked change of another step
  useEffect(() => {
    let isRerenderRequired = false;

    // if status has changed, store them on ref object and enable rerender
    const checkStatus = (statusRef: React.MutableRefObject<boolean>, newStatus: boolean): void => {
      if (!strictEqual(statusRef.current, newStatus)) {
        // eslint-disable-next-line no-param-reassign
        statusRef.current = newStatus;
        isRerenderRequired = true;
      }
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const changedStep of changedSteps) {
      if (hooks.includes(changedStep)) {
        isRerenderRequired = true;
        break;
      }
    }

    checkStatus(previousTouched, isStepTouched);
    checkStatus(previousPending, isStepPending);
    checkStatus(previousFailed, isStepFailed);
    checkStatus(previousConfirmed, isStepConfirmed);
    checkStatus(previousOpen, isStepOpen);

    if (isRerenderRequired) rerender();
  }, [
    changedSteps,
    hooks,
    isStepTouched,
    isStepPending,
    isStepFailed,
    isStepConfirmed,
    isStepOpen,
  ]);

  return {
    step: {
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
    },
    stepsAPI: context,
    rerenderStatus,
  };
}

export { useStep };
