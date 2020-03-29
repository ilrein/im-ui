import React, {
  useEffect,
} from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import findIndex from 'ramda/src/findIndex';
import propEq from 'ramda/src/propEq';
import update from 'ramda/src/update';
import { toast } from 'react-toastify';

import { API_URL } from '../../constants';

const SocketConnection = ({
  children,
  session,
  es,
  updateESList,
}) => {
  useEffect(() => {
    const { shop } = session;
    const { products } = es;

    const socket = io.connect(API_URL);

    socket.on('connect', () => {
      socket.emit('room', shop);
    });

    socket.on('update', (data) => {
      /**
       * when it updates,
       * we should check our list in es/products/list
       * if ID is matched, replace it
       */
      const index = findIndex(propEq('id', data.id))(products.list);

      const updated = update(index, data, products.list);

      updateESList(updated);

      toast.success('Successfully updated', data.title);
    });

    socket.on('syncProgressUpdate', (num) => {
      console.log('syncProgressUpdate', num);
    });

    return () => socket.close();
  }, [session, es]); // eslint-disable-line

  return (
    <div>
      {children}
    </div>
  )
}

export default connect(
  ({ session, es }) => ({ session, es }),
  dispatch => ({
    updateESList: (payload) => dispatch({
      type: 'STASH_PRODUCTS_ES',
      payload,
    })
  }),
)(SocketConnection);
