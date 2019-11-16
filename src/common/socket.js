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

export const emitOpportunity = Id => {
  console.log('Subscribing to ', Id);
  socket.emit('opportunity', { Id });
};

export const subscribeToOpportunity = (Id, cb) => {
  socket.on(`opportunity-${Id}`, cb);
};

export const unSubscribeToOpportunity = (Id, cb) => {
  socket.off(`opportunity-${Id}`, cb);
};

export const emitOpportunitySystemImage = Id => {
  console.log('Subscribing to ', Id);
  socket.emit('systemImage', { Id });
};

export const subscribeToOpportunitySystemImage = (Id, cb) => {
  socket.on(`systemImage-${Id}`, cb);
};

export const unSubscribeToOpportunitySystemImage = (Id, cb) => {
  socket.off(`systemImage-${Id}`, cb);
};

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
