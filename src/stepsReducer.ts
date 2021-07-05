import { StepsState } from './types/state';
import { ReducerActions } from './types/reducer';
import { StepsBooleanInfo } from './types/info';

const getOpenSteps = <Steps>(stepsInfo: StepsBooleanInfo<Steps>, nextStep?: keyof Steps) =>
  nextStep === undefined ? stepsInfo : { ...stepsInfo, [nextStep]: true };

const getVisitedSteps = <Steps>(stepsInfo: StepsBooleanInfo<Steps>, nextStep?: keyof Steps) => {
  if (nextStep === undefined) return stepsInfo;
  if (stepsInfo[nextStep] === true) return stepsInfo;
  return { ...stepsInfo, [nextStep]: true };
};

const getStepValues = <Steps, StepID extends keyof Steps>(
  stepsValues: Steps,
  stepID: StepID,
  newValues?: Steps[StepID]
) => (newValues === undefined ? stepsValues : { ...stepsValues, [stepID]: newValues });

const makeStateAfterTouching = <Steps>(state: StepsState<Steps>, stepID: keyof Steps) => {
  const isStepActive = state.activeStep === stepID;
  const isStepTouched = state.touchedSteps[stepID] === true;
  const isStepNotConfirmed = state.confirmedSteps[stepID] !== true;

  if (isStepActive && isStepTouched && isStepNotConfirmed) return state;
  return {
    ...state,
    activeStep: stepID,
    touchedSteps: isStepTouched ? state.touchedSteps : { ...state.touchedSteps, [stepID]: true },
    confirmedSteps: isStepNotConfirmed
      ? state.confirmedSteps
      : { ...state.confirmedSteps, [stepID]: false },
  };
};

const stepsReducer = <Steps>(state: StepsState<Steps>, action: ReducerActions<Steps>) => {
  console.log('- START DISPATCH -');
  console.log(action.type);
  console.log(action.payload);
  console.log('- FINISH DISPATCH -');
  switch (action.type) {
    case 'SET_ALL_VALUES':
      return { ...state, values: action.payload };
    case 'SET_ALL_CONFIRMED_STATUSES':
      return { ...state, confirmedSteps: action.payload };
    case 'SET_ALL_TOUCHED_STATUSES':
      return { ...state, touchedSteps: action.payload };
    case 'SET_ALL_FAILED_STATUSES':
      return { ...state, failedSteps: action.payload };
    case 'SET_ALL_OPEN_STATUSES':
      return { ...state, openSteps: action.payload };
    case 'SET_ALL_PENDING_STATUSES':
      return { ...state, pendingSteps: action.payload };
    case 'SET_STEP_VALUES':
      return {
        ...state,
        values: { ...state.values, [action.payload.stepID]: action.payload.values },
      };
    case 'SET_STEP_OPEN_STATUS':
      return {
        ...state,
        openSteps: { ...state.openSteps, [action.payload.stepID]: action.payload.isOpen },
      };
    case 'SET_STEP_ACTIVE_STATUS':
      return {
        ...state,
        activeStep: action.payload.isActive ? action.payload.stepID : state.activeStep,
      } as StepsState<Steps>;
    case 'SET_STEP_TOUCHED_STATUS':
      return {
        ...state,
        touchedSteps: { ...state.touchedSteps, [action.payload.stepID]: action.payload.isTouched },
      };
    case 'SET_STEP_PENDING_STATUS':
      return {
        ...state,
        pendingSteps: { ...state.pendingSteps, [action.payload.stepID]: action.payload.isPending },
      };
    case 'CONFIRM_STEP':
      return {
        ...state,
        activeStep: action.payload.nextStep || '',
        values: getStepValues(state.values, action.payload.stepID, action.payload.newValues),
        confirmedSteps: { ...state.confirmedSteps, [action.payload.stepID]: true },
        touchedSteps: { ...state.touchedSteps, [action.payload.stepID]: false },
        failedSteps: { ...state.failedSteps, [action.payload.stepID]: false },
        openSteps: getOpenSteps(state.openSteps, action.payload.nextStep),
        visitedSteps: getVisitedSteps(state.openSteps, action.payload.nextStep),
      };
    case 'RESET_STEP_CONFIRMATION':
      return {
        ...state,
        confirmedSteps: { ...state.confirmedSteps, [action.payload.stepID]: false },
      };
    case 'SET_STEP_FAILED_STATUS':
      return {
        ...state,
        failedSteps: {
          ...state.failedSteps,
          [action.payload.stepID]: action.payload.isFailed,
        },
      };
    case 'TOUCH_STEP':
      return makeStateAfterTouching(state, action.payload.stepID);
    case 'SET_STEPS_ORDER':
      return { ...state, orderHash: action.payload };
    default:
      return state;
  }
};

export { stepsReducer };
