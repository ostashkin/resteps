import { StepsBase } from './steps';
import { StepsInfo } from './info';

export interface SetActiveState<StepsHash extends StepsBase> {
  <StepID extends keyof StepsHash>(stepID: StepID, payload: boolean): void;
}

export interface ParamsWithRender {
  render?: boolean;
}

export interface SetConfirmedStateParams<StepsHash extends StepsBase> extends ParamsWithRender {
  nextStep?: keyof StepsHash;
}

export interface SetConfirmedState<StepsHash extends StepsBase> {
  (payload: StepsHash): void;
  <StepID extends keyof StepsHash>(
    stepID: StepID,
    params: SetConfirmedStateParams<StepsHash>
  ): void;
}

export interface ResetConfirmation<StepsHash extends StepsBase> {
  <StepID extends keyof StepsHash>(stepID: StepID, params: ParamsWithRender): void;
}

export interface SetState<StepsHash extends StepsBase> {
  (payload: StepsHash): void;
  <StepID extends keyof StepsHash, Payload>(stepID: StepID, payload: Payload): void;
}

export interface GetState<StepsHash extends StepsBase, StateValue> {
  (): StepsInfo<StepsHash, StateValue>;
  <StepID extends keyof StepsHash>(stepID: StepID): StateValue;
}

export interface TouchStep<StepsHash extends StepsBase> {
  <StepID extends keyof StepsHash>(stepID: StepID): void;
}

export interface StepsAPI<StepsHash extends StepsBase> {
  setActive: SetActiveState<StepsHash>;
  setTouched: SetState<StepsHash>;
  setOpen: SetState<StepsHash>;
  setPending: SetState<StepsHash>;
  setValues: SetState<StepsHash>;
  setConfirmed: SetConfirmedState<StepsHash>;
  resetConfirmation: ResetConfirmation<StepsHash>;
  setFailed: SetState<StepsHash>;
  getValues: GetState<StepsHash, any>;
  getConfirmed: GetState<StepsHash, boolean>;
  touchStep: TouchStep<StepsHash>;
}
