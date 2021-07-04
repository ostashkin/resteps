import React, { useEffect, useRef } from 'react';
import { ConfirmationValues, StepsConfig } from './types/config';
import { StepsBase } from './types/steps';
import { StepsState } from './types/state';
import { ReducerActions } from './types/reducer';
import { stepsReducer } from './stepsReducer';
import { StepsBooleanInfo } from './types/info';
import { GetState, SetConfirmedStateParams } from './types/api';
import { StepsProvider } from './stepsContext';
import { findChangedSteps, strictEqual } from './utils';
import { StepsContext } from './types/context';

function createConfirmationValues<StepsHash extends StepsBase>(
  state: StepsState<StepsHash>
): ConfirmationValues<StepsHash> {
  return {
    values: state.values,
    activeStep: state.activeStep,
    confirmedSteps: state.confirmedSteps,
    failedSteps: state.failedSteps,
    openedSteps: state.openSteps,
    touchedSteps: state.touchedSteps,
  };
}

function useSteps<StepsHash extends StepsBase = StepsBase>(
  config: StepsConfig<StepsHash>
): StepsContext<StepsHash> {
  const initialValues = React.useRef<StepsHash>(config.initialValues);
  const initialActive = React.useRef<keyof StepsHash>(config.initialActive);
  const changedSteps = React.useRef<(keyof StepsHash)[]>([]);

  const [state, dispatch] = React.useReducer<
    React.Reducer<StepsState<StepsHash>, ReducerActions<StepsHash>>
  >(stepsReducer, {
    values: config.initialValues,
    activeStep: config.initialActive,
    confirmedSteps: config.initialConfirmed || {},
    touchedSteps: config.initialTouched || {},
    failedSteps: config.initialFailed || {},
    openSteps: {
      ...config.initialOpen,
      [config.initialActive]: true,
    } as StepsBooleanInfo<StepsHash>,
    pendingSteps: config.initialPending || {},
    orderHash: {},
  });

  const needToCallConfirmCallback = useRef<boolean>(false);
  useEffect(() => {
    if (needToCallConfirmCallback) {
      needToCallConfirmCallback.current = false;
      if (config.onStepConfirmed !== undefined) {
        config.onStepConfirmed(createConfirmationValues(state));
      }
    }
  }, [state.confirmedSteps]);

  const previousValues = useRef<StepsHash>(config.initialValues);

  useEffect(() => {
    if (!strictEqual(state.values, previousValues.current)) {
      previousValues.current = state.values;
    }
  }, [state.values]);

  function setOpen<StepID extends keyof StepsHash>(
    stepIDORPayload: StepID | StepsBooleanInfo<StepsHash>,
    isOpen?: boolean
  ) {
    if (typeof stepIDORPayload === 'object') {
      dispatch({ type: 'SET_ALL_OPEN_STATUSES', payload: stepIDORPayload });
    } else {
      dispatch({
        type: 'SET_STEP_OPEN_STATUS',
        payload: { stepID: stepIDORPayload, isOpen: isOpen as StepsHash[StepID] },
      });
    }
  }

  function setFailed<StepID extends keyof StepsHash>(
    stepIDORPayload: StepID | StepsBooleanInfo<StepsHash>,
    isFailed?: boolean
  ) {
    if (typeof stepIDORPayload === 'object') {
      dispatch({ type: 'SET_ALL_FAILED_STATUSES', payload: stepIDORPayload });
    } else {
      dispatch({
        type: 'SET_STEP_FAILED_STATUS',
        payload: { stepID: stepIDORPayload, isFailed: isFailed as StepsHash[StepID] },
      });
    }
  }

  function setPending<StepID extends keyof StepsHash>(
    stepIDORPayload: StepID | StepsBooleanInfo<StepsHash>,
    isPending?: boolean
  ) {
    if (typeof stepIDORPayload === 'object') {
      dispatch({ type: 'SET_ALL_PENDING_STATUSES', payload: stepIDORPayload });
    } else {
      dispatch({
        type: 'SET_STEP_PENDING_STATUS',
        payload: { stepID: stepIDORPayload, isPending: isPending as StepsHash[StepID] },
      });
    }
  }

  function setTouched<StepID extends keyof StepsHash>(
    stepIDORPayload: StepID | StepsBooleanInfo<StepsHash>,
    isTouched?: boolean
  ) {
    if (typeof stepIDORPayload === 'object') {
      dispatch({ type: 'SET_ALL_TOUCHED_STATUSES', payload: stepIDORPayload });
    } else {
      dispatch({
        type: 'SET_STEP_TOUCHED_STATUS',
        payload: { stepID: stepIDORPayload, isTouched: isTouched as StepsHash[StepID] },
      });
    }
  }

  function setValues<StepID extends keyof StepsHash>(
    stepIDORPayload: StepID | StepsHash,
    values?: StepsHash[StepID]
  ) {
    if (typeof stepIDORPayload === 'object') {
      // TODO Write comment or refactor
      changedSteps.current = findChangedSteps(stepIDORPayload, previousValues.current);
      dispatch({ type: 'SET_ALL_VALUES', payload: stepIDORPayload });
    } else {
      console.log('changed values', stepIDORPayload, values);
      // TODO Write comment or refactor
      changedSteps.current = [stepIDORPayload];
      dispatch({
        type: 'SET_STEP_VALUES',
        payload: { stepID: stepIDORPayload, values },
      });
    }
  }

  function setActive<StepID extends keyof StepsHash>(stepID: StepID, isActive: boolean) {
    // TODO some refactor and comments
    const isTargetStepOpen = state.openSteps[stepID];
    if (isActive && !isTargetStepOpen) {
      dispatch({ type: 'SET_STEP_OPEN_STATUS', payload: { stepID, isOpen: true } });
    }
    dispatch({ type: 'SET_STEP_ACTIVE_STATUS', payload: { stepID, isActive } });
  }

  function getValues<StepID extends keyof StepsHash>(stepID?: StepID) {
    const values = { ...state.values };
    if (stepID === undefined) return values;
    const { [stepID]: stepValues } = values;
    if (typeof stepValues === 'object') return { ...stepValues };
    return stepValues;
  }

  function getConfirmed<StepID extends keyof StepsHash>(
    stepID?: StepID
  ): StepsBooleanInfo<StepsHash> | boolean {
    const confirmedSteps = { ...state.confirmedSteps };
    if (stepID === undefined) return confirmedSteps;
    const { [stepID]: isStepConfirmed } = confirmedSteps;
    return isStepConfirmed || false;
  }

  function setConfirmed<StepID extends keyof StepsHash>(
    stepIDORPayload: StepID | StepsBooleanInfo<StepsHash>,
    params: SetConfirmedStateParams<StepsHash, StepID> = {}
  ) {
    needToCallConfirmCallback.current = true;
    if (typeof stepIDORPayload === 'object') {
      dispatch({ type: 'SET_ALL_CONFIRMED_STATUSES', payload: stepIDORPayload });
    } else {
      const defaultParams: SetConfirmedStateParams<StepsHash, StepID> = {
        nextStep: '',
        render: true,
      };
      const mergedParams: SetConfirmedStateParams<StepsHash, StepID> = Object.assign(
        defaultParams,
        params
      );
      dispatch({
        type: 'CONFIRM_STEP',
        payload: {
          stepID: stepIDORPayload,
          nextStep: mergedParams.nextStep,
          newValues: mergedParams.newValues,
        },
      });
    }
  }

  function resetConfirmation(stepID: keyof StepsHash) {
    dispatch({ type: 'RESET_STEP_CONFIRMATION', payload: { stepID } });
  }

  function touchStep(stepID: keyof StepsHash) {
    dispatch({ type: 'TOUCH_STEP', payload: { stepID } });
  }

  const isReorderRequired = useRef<boolean>(true);
  const stepsOrder = useRef<(keyof StepsHash)[]>([]);
  const previousStepsOrder = useRef<(keyof StepsHash)[]>([]);

  const createStepsOrder = (id: keyof StepsHash) => {
    if (previousStepsOrder.current.length === 0) {
      stepsOrder.current.push(id);
    } else {
      const stepOrder = stepsOrder.current.push(id);
      if (stepOrder !== state.orderHash[id]) {
        isReorderRequired.current = true;
      }
    }
  };

  useEffect(() => {
    if (isReorderRequired.current) {
      isReorderRequired.current = false;
      previousStepsOrder.current = Array.prototype.concat.call(stepsOrder.current);
      const orderHash = stepsOrder.current.reduce(
        (acc, stepID, index) => ({ ...acc, [stepID]: index + 1 }),
        {}
      );
      dispatch({ type: 'SET_STEPS_ORDER', payload: orderHash });
    }
    stepsOrder.current.length = 0;
  });

  return {
    ...state,
    initialValues: initialValues.current,
    initialActive: initialActive.current,
    changedSteps: changedSteps.current,
    setActive,
    setOpen,
    setConfirmed,
    resetConfirmation,
    setFailed,
    setPending,
    setTouched,
    setValues,
    getValues,
    getConfirmed: getConfirmed as GetState<StepsHash, boolean>,
    calculateStepOrder: createStepsOrder,
    touchStep,
  };
}

function Steps<StepsHash extends StepsBase = StepsBase>(config: StepsConfig<StepsHash>) {
  const contextValue = useSteps<StepsHash>(config);
  const { calculateStepOrder, ...childrenProps } = contextValue;
  const { children } = config;
  return <StepsProvider value={contextValue}>{children(childrenProps)}</StepsProvider>;
}

export { Steps };
