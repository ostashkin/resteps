import { StepsState } from './types/state';
import { ReducerActions } from './types/reducer';

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
    case 'SET_STEP_CONFIRMED_STATUS':
      return {
        ...state,
        confirmedSteps: {
          ...state.confirmedSteps,
          [action.payload.stepID]: action.payload.isConfirmed,
        },
      };
    case 'SET_STEP_FAILED_STATUS':
      return {
        ...state,
        failedSteps: {
          ...state.failedSteps,
          [action.payload.stepID]: action.payload.isFailed,
        },
      };
    default:
      return state;
  }
};

export { stepsReducer };
