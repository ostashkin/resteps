import React, { useMemo } from 'react';
import { ConnectedStepProps, StepComponentProps } from './types/ConnectedStep';
import { useStep } from './useStep';

function connect<ComponentProps extends StepComponentProps>(
  Component: React.ComponentType<ComponentProps>,
  hooks: string[] = []
): React.ComponentType<ConnectedStepProps> {
  const ConnectedComponent: React.FC<ConnectedStepProps> = ({ id }) => {
    // unconfirmedValues();
    // validated();
    // detectChange();

    // TODO THIS COMPONENT WILL ALWAYS RERENDER, BUT WRAPPED COMPONENT SHOULD HAS MEMOIZATION
    const { rerenderStatus, ...restContext } = useStep(id, hooks);

    return useMemo(() => <Component {...(restContext as any)} />, [rerenderStatus]);
  };

  return ConnectedComponent;
}

export { connect };
