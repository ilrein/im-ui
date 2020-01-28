import React, {
  useEffect,
} from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';

import { API_URL } from '../../constants';

const SocketConnection = ({
  children,
  session,
}) => {
  useEffect(() => {
    const { shop } = session;
    
    console.log('SocketConnection mounted, trying to join room', shop);

    const socket = io.connect(API_URL);

    // Topics: [products/create, products/update, products/delete]

    socket.on('connect', () => {
      console.log('connected...', shop);

      socket.emit('room', shop);
    });

    socket.on('update', (data) => {
      console.log('incoming data', data);
    })

    return () => socket.close();
  }, [session]); // eslint-disable-line

  return (
    <div>
      {children}
    </div>
  )
}

export default connect(
  ({ session }) => ({ session }),
)(SocketConnection);
