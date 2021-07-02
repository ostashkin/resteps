import React, { useEffect, useRef, useState } from 'react';
import { StepsBase } from './types/steps';
import { useStepsContext } from './stepsContext';
import { UseStepResult } from './types/useStep';
import { strictEqual } from './utils';
import { SetConfirmedStateParams } from './types/api';

function useStep<StepsHash extends StepsBase, StepID extends keyof StepsHash>(
  stepID: StepID,
  hooks: (keyof StepsHash)[]
): UseStepResult<StepsHash, StepsHash[StepID]> {
  const context = useStepsContext<StepsHash>();

  /**
   * We need to track internal re-renders to prevent
   * the execution of the step number calculation function
   */
  const isInnerRerender = useRef<boolean>(false);
  useEffect(() => {
    if (isInnerRerender.current) {
      /** If this is an internal rerender, we reset the ref */
      isInnerRerender.current = false;
    } else {
      /** If this is an external rerender,
       * we execute the function for calculating the step number
       * */
      context.calculateStepOrder(stepID);
    }
  });

  const {
    // Initial values
    initialValues,
    initialActive,
    // Current state
    values,
    activeStep,
    confirmedSteps,
    openSteps,
    failedSteps,
    pendingSteps,
    touchedSteps,
    orderHash,
    // API
    setValues,
    setOpen,
    setTouched,
    setActive,
    setConfirmed,
    setFailed,
    setPending,
    // touching
    touchStep,
    // Last modified steps (Only the value change in value is taken)
    changedSteps,
  } = context;

  /** Specifying the state values for the step */
  const stepInitialValues = initialValues[stepID];
  const stepInitialActive = initialActive === stepID;
  const order = orderHash[stepID];
  const currentStepValues = values[stepID];
  const isStepActive = activeStep === stepID;
  const isStepConfirmed: boolean = confirmedSteps[stepID] || false;
  const isStepOpen: boolean = openSteps[stepID] || false;
  const isStepFailed: boolean = failedSteps[stepID] || false;
  const isStepPending: boolean = pendingSteps[stepID] || false;
  const isStepTouched: boolean = touchedSteps[stepID] || false;

  /** Refs keep track of previous values */
  const previousOrder = useRef<number | undefined>(order);
  const isPreviousActive = useRef<boolean>(isStepActive);
  const isPreviousOpen = useRef<boolean>(isStepOpen);
  const isPreviousConfirmed = useRef<boolean>(isStepConfirmed);
  const isPreviousFailed = useRef<boolean>(isStepFailed);
  const isPreviousPending = useRef<boolean>(isStepPending);
  const isPreviousTouched = useRef<boolean>(isStepTouched);

  /** Specifying the API for the step */
  const setStepValues = (stepValues: StepsHash[StepID]) => setValues(stepID, stepValues);
  const setStepOpenStatus = (status: boolean) => setOpen(stepID, status);
  const setStepTouchedStatus = (status: boolean) => setTouched(stepID, status);
  const setStepActiveStatus = (status: boolean) => setActive(stepID, status);
  const setStepPendingStatus = (status: boolean) => setPending(stepID, status);
  const setStepFailedStatus = (status: boolean) => setFailed(stepID, status);
  const setStepConfirmedStatus = (params: SetConfirmedStateParams<StepsHash> = {}) => {
    /** If the step was touched or failed,
     * then its confirmation should set these statuses to 'false'
     * */
    // if (isStepTouched) setStepTouchedStatus(false);
    // if (isStepFailed) setStepFailedStatus(false);
    setConfirmed(stepID, params);
  };

  /**
   * The re-render status is used in the connected component, in the useMemo.
   * It allows to optimize component re-renders
   * and skip re-renders that will not affect this step
   */
  const [rerenderStatus, setRerenderState] = useState(0);
  const rerender = () => {
    setRerenderState((prevState) => prevState + 1);
  };

  /** Checking whether to re-render after a state change */
  useEffect(() => {
    let isRerenderRequired = false;

    /** Helper function for step states with previous values.
     * If any of the states changes, change its previous value
     * and mark the necessity of a re-renderer
     * */
    const checkStatus = <Value>(
      statusRef: React.MutableRefObject<Value>,
      newStatus: Value
    ): void => {
      if (!strictEqual(statusRef.current, newStatus)) {
        // eslint-disable-next-line no-param-reassign
        statusRef.current = newStatus;
        isRerenderRequired = true;
      }
    };

    /**
     * If any of the steps followed by the current step has changed,
     * we note the necessity of a re-renderer
     */
    // eslint-disable-next-line no-restricted-syntax
    for (const changedStep of changedSteps) {
      if (hooks.includes(changedStep)) {
        isRerenderRequired = true;
        break;
      }
    }

    checkStatus(previousOrder, order);
    checkStatus(isPreviousActive, isStepActive);
    checkStatus(isPreviousTouched, isStepTouched);
    checkStatus(isPreviousPending, isStepPending);
    checkStatus(isPreviousFailed, isStepFailed);
    checkStatus(isPreviousConfirmed, isStepConfirmed);
    checkStatus(isPreviousOpen, isStepOpen);

    if (isRerenderRequired) {
      /**
       * Mark re-render as internal to prevent
       * the execution of the step number calculation function
       */
      isInnerRerender.current = true;
      rerender();
    }
  }, [
    changedSteps,
    hooks,
    isStepActive,
    isStepTouched,
    isStepPending,
    isStepFailed,
    isStepConfirmed,
    isStepOpen,
    order,
  ]);

  /**
   * Changing the step should make it active.
   * This function must be used in a final custom component
   * as part of event handlers.
   */
  const detectChange = () => {
    touchStep(stepID);
    // TODO temporary
    // setStepActiveStatus(true);
    // setStepTouchedStatus(true);
    // setStepConfirmedStatus(false);
    // if (!isStepActive) {
    //   console.log('step was passive!');
    //   setStepActiveStatus(true);
    //   setStepTouchedStatus(true);
    //   if (isStepConfirmed) {
    //     console.log('step was confirmed!');
    //     setStepConfirmedStatus(false);
    //   }
    // } else if (!isStepTouched) {
    //   console.log('step was active, but not touched!');
    //   setStepTouchedStatus(true);
    // }
  };

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
      detectChange,
      order,
    },
    stepsAPI: context,
    rerenderStatus,
  };
}

export { useStep };
