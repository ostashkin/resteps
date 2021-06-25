import React from 'react';
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

    const connectedComponents: Omit<ConnectConfig, 'layout'> = {
      body: body ? connectContext(body) : undefined,
      number: number ? connectContext(number) : undefined,
      label: label ? connectContext(label) : undefined,
      border: border ? connectContext(border) : undefined,
      footer: footer ? connectContext(footer) : undefined,
    };

    return <Layout {...connectedComponents} />;
  };

  return ConnectedComponent;
}

export { connect };
