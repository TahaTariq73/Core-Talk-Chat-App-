const mongoose = require("mongoose");

const connectToMongo = async () => {
    try {
        const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qmjpjvm.mongodb.net/?retryWrites=true&w=majority`;

        const connect = await mongoose.connect(MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })

        console.log(`Connected to MongoDB : ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
}

module.exports = connectToMongo;