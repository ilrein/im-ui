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

    socket.on('news', (data) => {
      console.log('data', data);
    })
  }, []);

  return (
    <div>
      {children}
    </div>
  )
}

export default SocketConnection;
