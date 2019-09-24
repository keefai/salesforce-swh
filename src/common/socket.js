import io from 'socket.io-client';
const socket = io.connect(process.env.REACT_APP_socketURL);

socket.on('connect', () => {
  console.log('connected');
});

socket.on('error', (error) => {
  console.log('socket connected ERROR');
  console.log(error);
});

socket.on('connect_timeout', (error) => {
  console.log('socket connected connect_timeout');
  console.log(error);
});

socket.on('connect_error', (error) => {
  console.log('socket connected connect_error');
  console.log(error);
});

// export const socketEmitNotification = UserID => {
//   console.log('Subscribing to ', UserID);
//   socket.emit('notification', { UserID });
// };

// export const socketSubscribeToNotications = (UserID, cb) => {
//   socket.on(UserID, cb);
// };

// export const subscribeToTradeOrder = (cb) => {
//   socket.on('tradeOrder', cb);
// };

// export const unSubscribeToTradeOrder = (cb) => {
//   socket.off('tradeOrder', cb);
// };

// export const subscribeToTradeSet = (cb) => {
//   socket.on('tradeSet', cb);
// };

// export const unSubscribeToTradeSet = (cb) => {
//   socket.off('tradeSet', cb);
// };

// export const subscribeToASXCode = (cb) => {
//   socket.on('asxCode', cb);
// };

// export const unSubscribeToASXCode = (cb) => {
//   socket.off('asxCode', cb);
// };

export default socket;
