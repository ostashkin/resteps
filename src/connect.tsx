import React, { useMemo } from 'react';
import { ConnectedStepProps, StepComponentProps } from './types/ConnectedStep';
import { useStep } from './useStep';
import { Debug } from './Debug';

function connect<ComponentProps extends StepComponentProps>(
  Component: React.ComponentType<ComponentProps>,
  hooks: string[] = []
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
