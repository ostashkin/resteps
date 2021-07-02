import { StepsBase } from './steps';
import { StepsBooleanInfo, StepsInfo } from './info';

export type ReducerActions<Steps extends StepsBase> =
  // Actions applied to whole Steps State
  | { type: 'SET_ALL_VALUES'; payload: Steps }
  | { type: 'SET_ALL_OPEN_STATUSES'; payload: StepsBooleanInfo<Steps> }
  | { type: 'SET_ALL_TOUCHED_STATUSES'; payload: StepsBooleanInfo<Steps> }
  | { type: 'SET_ALL_PENDING_STATUSES'; payload: StepsBooleanInfo<Steps> }
  | { type: 'SET_ALL_CONFIRMED_STATUSES'; payload: StepsBooleanInfo<Steps> }
  | { type: 'SET_ALL_FAILED_STATUSES'; payload: StepsBooleanInfo<Steps> }
  // Actions applied to specific Step
  | { type: 'SET_STEP_VALUES'; payload: { stepID: keyof Steps; values: any } }
  | { type: 'SET_STEP_ACTIVE_STATUS'; payload: { stepID: keyof Steps; isActive: boolean } }
  | { type: 'SET_STEP_TOUCHED_STATUS'; payload: { stepID: keyof Steps; isTouched: boolean } }
  | { type: 'SET_STEP_OPEN_STATUS'; payload: { stepID: keyof Steps; isOpen: boolean } }
  | { type: 'SET_STEP_PENDING_STATUS'; payload: { stepID: keyof Steps; isPending: boolean } }
  | { type: 'SET_STEP_FAILED_STATUS'; payload: { stepID: keyof Steps; isFailed: boolean } }
  // Step confirmation
  | {
      type: 'CONFIRM_STEP';
      payload: { stepID: keyof Steps; newValues: any; nextStep?: keyof Steps };
    }
  | { type: 'RESET_STEP_CONFIRMATION'; payload: { stepID: keyof Steps } }
  // Step touching
  | { type: 'TOUCH_STEP'; payload: { stepID: keyof Steps } }
  // Action for creating steps order
  | { type: 'SET_STEPS_ORDER'; payload: StepsInfo<Steps, number> };
