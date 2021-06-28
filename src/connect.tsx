import React, { useMemo } from 'react';
import { ConnectedStepProps, StepComponentProps } from './types/ConnectedStep';
import { useStep } from './useStep';
import { Debug } from './Debug';
import { StepsBase } from './types/steps';

function connect<
  StepsHash extends StepsBase = any,
  Value = any,
  ComponentProps = StepComponentProps<StepsHash, Value>
>(
  Component: React.ComponentType<ComponentProps>,
  hooks: (keyof StepsHash)[] = []
): React.ComponentType<ConnectedStepProps> {
  const ConnectedComponent: React.FC<ConnectedStepProps> = ({ id, debug }) => {
    // unconfirmedValues();
    // validated();
    // detectChange();

    // TODO THIS COMPONENT WILL ALWAYS RERENDER, BUT WRAPPED COMPONENT SHOULD HAS MEMOIZATION
    const { rerenderStatus, ...restContext } = useStep(id, hooks);

    const renderDebug = () => {
      if (!debug) return null;
      const { step } = restContext;

      return (
        <Debug
          id={id}
          order={step.order}
          value={step.currentValue}
          isActive={step.isActive}
          isTouched={step.isTouched}
          isOpen={step.isOpen}
          isPending={step.isPending}
          isConfirmed={step.isConfirmed}
          isFailed={step.isFailed}
          rerenderStatus={rerenderStatus}
        />
      );
    };
    const step = useMemo(() => <Component {...(restContext as any)} />, [rerenderStatus]);
    return (
      <>
        {renderDebug()}
        {step}
      </>
    );
  };

  return ConnectedComponent;
}

export { connect };
