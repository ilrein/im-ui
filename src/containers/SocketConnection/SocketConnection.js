import React, {
  useEffect,
} from 'react';
import io from 'socket.io-client';

import { API_URL } from '../../constants';

const SocketConnection = ({
  children,
}) => {
  useEffect(() => {
    console.log('SocketConnection mounted');

    const socket = io.connect(API_URL);

    // Topics: [products/create, products/update, products/delete]

    socket.on('news', (data) => {
      console.log('data', data);
    });

    return () => socket.close();
  }, []);

  return (
    <div>
      {children}
    </div>
  )
}

export default SocketConnection;
