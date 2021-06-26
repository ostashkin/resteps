import React, { useMemo } from 'react';
import { StepsChildrenProps } from './types/props';
import { useStepsContext } from './stepsContext';

interface ConnectConfig {
  layout: React.ComponentType<Omit<ConnectConfig, 'layout'>>; // в пропсах должны быть нижестоящие компоненты;
  number?: React.ComponentType<StepsChildrenProps<any>>;
  label?: React.ComponentType<StepsChildrenProps<any>>;
  border?: React.ComponentType<StepsChildrenProps<any>>;
  body?: React.ComponentType<StepsChildrenProps<any>>;
  footer?: React.ComponentType<StepsChildrenProps<any>>;
}

function connect(config: ConnectConfig): React.ComponentType<any> {
  const ConnectedComponent: React.FC = () => {
    // unconfirmedValues();
    // validated();
    // detectChange();

    const context = useStepsContext();

    const { layout: Layout, body, border, footer, label, number } = config;

    function connectContext<ComponentProps>(Component: React.ComponentType<ComponentProps>) {
      const WrappedComponent: React.FC<ComponentProps> = (props) => (
        <Component {...props} {...context} />
      );
      return WrappedComponent;
    }

    const memoizedBody = useMemo(
      () => (body === undefined ? undefined : connectContext(body)),
      [body]
    );

    const memoizedNumber = useMemo(
      () => (border === undefined ? undefined : connectContext(border)),
      [border]
    );

    const memoizedLabel = useMemo(
      () => (footer === undefined ? undefined : connectContext(footer)),
      [footer]
    );

    const memoizedBorder = useMemo(
      () => (label === undefined ? undefined : connectContext(label)),
      [label]
    );

    const memoizedFooter = useMemo(
      () => (number === undefined ? undefined : connectContext(number)),
      [number]
    );

    return (
      <Layout
        body={memoizedBody}
        number={memoizedNumber}
        label={memoizedLabel}
        border={memoizedBorder}
        footer={memoizedFooter}
      />
    );
  };

  return ConnectedComponent;
}

export { connect };
