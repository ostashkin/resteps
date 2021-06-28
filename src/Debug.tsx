import React, { useEffect, useRef } from 'react';
import { DebugProps } from './types/debug';

const Debug: React.FC<DebugProps> = (props) => {
  const {
    value,
    id,
    order,
    isConfirmed,
    isOpen,
    isActive,
    isPending,
    isTouched,
    isFailed,
    rerenderStatus,
  } = props;

  const isRendered = useRef(true);
  const previousRerenderStatus = useRef(rerenderStatus);

  useEffect(() => {
    isRendered.current = rerenderStatus !== previousRerenderStatus.current;
    previousRerenderStatus.current = rerenderStatus;
  }, [rerenderStatus]);

  const renderInfo = (info: any) => JSON.stringify(info, null, ' ');

  return (
    <div style={{ padding: '10px', backgroundColor: '#FAE9E9', color: 'black' }}>
      <h6>{id}</h6>
      <p style={{ fontFamily: 'monospace', fontSize: '11px' }}>
        <strong>Order:</strong> <span>{renderInfo(order)}</span>
        <br />
        <strong>Active:</strong> <span>{renderInfo(isActive)}</span>
        <br />
        <strong>Touched:</strong> <span>{renderInfo(isTouched)}</span>
        <br />
        <strong>Open:</strong> <span>{renderInfo(isOpen)}</span>
        <br />
        <strong>Pending:</strong> <span>{renderInfo(isPending)}</span>
        <br />
        <strong>Confirmed:</strong> <span>{renderInfo(isConfirmed)}</span>
        <br />
        <strong>Failed:</strong> <span>{renderInfo(isFailed)}</span>
        <br />
        <strong>Re-rendered:</strong> <span>{renderInfo(isRendered.current)}</span>
      </p>
      <pre
        style={{
          backgroundColor: '#e7e7e7',
          padding: '8px',
          margin: '0',
          fontSize: '11px',
        }}
      >
        {renderInfo(value)}
      </pre>
    </div>
  );
};

export { Debug };
