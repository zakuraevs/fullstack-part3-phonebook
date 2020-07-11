const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');


//This doesnt work on heroku
//Because url is in an .env file
//which is gitignored, so Mongoose can't get 
//The database URL.
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 3
    },
    phone: {
        type: String,
        minlength: 8
    },
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)