import React, { useMemo } from 'react';
import { ConnectedStepProps } from './types/ConnectedStep';
import { useStep } from './useStep';

function connect(Component: React.ComponentType): React.ComponentType<ConnectedStepProps> {
  const ConnectedComponent: React.FC<ConnectedStepProps> = ({ id }) => {
    // unconfirmedValues();
    // validated();
    // detectChange();

    // TODO THIS COMPONENT WILL ALWAYS RERENDER, BUT WRAPPED COMPONENT SHOULD HAS MEMOIZATION

    const context = useStep(id);

    const MemoizedComponent = useMemo(
      () => (props: any) => <Component {...props} {...context} />,
      []
    );

    return <MemoizedComponent />;
  };

  return ConnectedComponent;
}

export { connect };
