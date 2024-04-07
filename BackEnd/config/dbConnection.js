const mongoose = require('mongoose');


const mongoUrl = process.env.MongoDbUrl;


const dbConnection = () =>{
    mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to Database Successfully..'))
    .catch((err) => console.error(' Could not connect to MongoDB...', err));
    
    
}



module.exports = dbConnection;