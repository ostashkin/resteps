import React from 'react';
import { StepsConfig } from './types/config';
import { StepsBase } from './types/steps';
import { StepsChildrenProps } from './types/props';
import { StepsState } from './types/state';
import { ReducerActions } from './types/reducer';
import { stepsReducer } from './stepsReducer';
import { StepsBooleanInfo } from './types/info';
import { GetState } from './types/api';
import { StepsProvider } from './stepsContext';

function useSteps<StepsHash extends StepsBase = StepsBase>(
  config: StepsConfig<StepsHash>
): StepsChildrenProps<StepsHash> {
  const initialValues = React.useRef<StepsHash>(config.initialValues);
  const initialActive = React.useRef<keyof StepsHash>(config.initialActive);

  const [state, dispatch] = React.useReducer<
    React.Reducer<StepsState<StepsHash>, ReducerActions<StepsHash>>
  >(stepsReducer, {
    values: config.initialValues,
    activeStep: config.initialActive,
    confirmedSteps: config.initialConfirmed || {},
    touchedSteps: config.initialTouched || {},
    failedSteps: {},
    openSteps: {
      ...config.initialOpen,
      [config.initialActive]: true,
    } as StepsBooleanInfo<StepsHash>,
    pendingSteps: config.initialPending || {},
  });

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

  function setConfirmed<StepID extends keyof StepsHash>(
    stepIDORPayload: StepID | StepsBooleanInfo<StepsHash>,
    isConfirmed?: boolean
  ) {
    if (typeof stepIDORPayload === 'object') {
      dispatch({ type: 'SET_ALL_CONFIRMED_STATUSES', payload: stepIDORPayload });
    } else {
      dispatch({
        type: 'SET_STEP_CONFIRMED_STATUS',
        payload: { stepID: stepIDORPayload, isConfirmed: isConfirmed as StepsHash[StepID] },
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
      dispatch({ type: 'SET_ALL_VALUES', payload: stepIDORPayload });
    } else {
      dispatch({
        type: 'SET_STEP_VALUES',
        payload: { stepID: stepIDORPayload, values },
      });
    }
  }

  function setActive<StepID extends keyof StepsHash>(stepID: StepID, isActive: boolean) {
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

  return {
    ...state,
    initialValues: initialValues.current,
    initialActive: initialActive.current,
    setActive,
    setOpen,
    setConfirmed,
    setFailed,
    setPending,
    setTouched,
    setValues,
    getValues,
    getConfirmed: getConfirmed as GetState<StepsHash, boolean>,
  };
}

function Steps<StepsHash extends StepsBase = StepsBase>(config: StepsConfig<StepsHash>) {
  const childrenProps = useSteps<StepsHash>(config);
  const { children } = config;
  return <StepsProvider value={childrenProps}>{children(childrenProps)}</StepsProvider>;
}

export { Steps };
