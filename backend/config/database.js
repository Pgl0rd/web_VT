const mongoose = require('mongoose');

let _connected = false;

async function connect(uri) {
  if (!uri) {
    console.log('No MONGO_URI provided; using file-based fallback store');
    _connected = false;
    return;
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 8000, socketTimeoutMS: 10000 });
  _connected = true;
  console.log('MongoDB connected');
}

function connected() {
  return _connected;
}

module.exports = { connect, connected };
