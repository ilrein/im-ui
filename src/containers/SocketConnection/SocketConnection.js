import React, {
  useEffect,
} from 'react';

const SocketConnection = ({
  children,
}) => {
  useEffect(() => {
    console.log('SocketConnection mounted');
  }, []);

  return (
    <div>
      {children}
    </div>
  )
}

export default SocketConnection;
