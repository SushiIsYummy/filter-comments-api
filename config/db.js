const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGODB_URI =
    process.env.NODE_ENV === 'development'
      ? process.env.MONGODB_URI_DEV
      : process.env.MONGODB_URI_PROD;
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.log(error);
  }
};

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = connectDB;
