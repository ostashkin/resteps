import { StepsInfo } from './types/info';
import { StepsBase } from './types/steps';

const strictEqual = (a: any, b: any): boolean => a === b;

const findChangedSteps = <StepsHash extends StepsBase, StepsInfoType>(
  newSteps: StepsInfo<StepsHash, StepsInfoType>,
  previousSteps: StepsInfo<StepsHash, StepsInfoType>
): (keyof StepsHash)[] => {
  const newStepsIDs = Object.keys(newSteps);
  const changedSteps = [];

  for (let i = 0; i < newStepsIDs.length; i += 1) {
    const stepID = newStepsIDs[i];
    if (
      Object.prototype.hasOwnProperty.call(previousSteps, stepID) ||
      !strictEqual(newSteps[stepID], previousSteps[stepID])
    ) {
      changedSteps.push(stepID);
    }
  }

  return changedSteps;
};

export { strictEqual, findChangedSteps };
