const mongoose = require('mongoose');

let _connected = false;
let _connectionPromise = null;

async function connect(uri) {
  if (_connectionPromise) return _connectionPromise;
  if (!uri) {
    console.log('No MONGO_URI provided; using file-based fallback store');
    _connected = false;
    _connectionPromise = Promise.resolve();
    return _connectionPromise;
  }
  _connectionPromise = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 8000, socketTimeoutMS: 10000 })
    .then(() => {
      _connected = true;
      console.log('MongoDB connected');
    })
    .catch(error => {
      _connectionPromise = null;
      throw error;
    });
  return _connectionPromise;
}

function connected() {
  return _connected;
}

module.exports = { connect, connected };
