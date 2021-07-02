import { StepsState } from './types/state';
import { ReducerActions } from './types/reducer';
import { StepsBooleanInfo } from './types/info';

const getOpenSteps = <Steps>(stepsInfo: StepsBooleanInfo<Steps>, nextStep?: keyof Steps) => {
  if (nextStep === undefined) return stepsInfo;
  return { ...stepsInfo, [nextStep]: stepsInfo[nextStep] };
};

const stepsReducer = <Steps>(state: StepsState<Steps>, action: ReducerActions<Steps>) => {
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
        confirmedSteps: { ...state.confirmedSteps, [action.payload.stepID]: true },
        touchedSteps: { ...state.touchedSteps, [action.payload.stepID]: false },
        failedSteps: { ...state.failedSteps, [action.payload.stepID]: false },
        openSteps: getOpenSteps(state.openSteps, action.payload.nextStep),
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
      return {
        ...state,
        activeStep: action.payload.stepID,
        confirmedSteps: { ...state.confirmedSteps, [action.payload.stepID]: false },
        touchedSteps: { ...state.touchedSteps, [action.payload.stepID]: true },
      };
    case 'SET_STEPS_ORDER':
      return { ...state, orderHash: action.payload };
    default:
      return state;
  }
};

export { stepsReducer };
