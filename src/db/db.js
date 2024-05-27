const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    const uri = 'mongodb+srv://aymen:maydena123*@cluster0.jexx1fu.mongodb.net/mydatabase'; // Your MongoDB URI
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = { connectToDatabase };
