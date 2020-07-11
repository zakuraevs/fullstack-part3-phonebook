const mongoose = require('mongoose')

//Helper function for generating ids
//Imperfect
const generateId = () => {
    const max = 10000
    return Math.floor(Math.random() * max)
}


//Checking that terminal command is at least 3 arguments long
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

//Set 3rd terminal argument as const password
const password = process.argv[2]

//Define const url with the password from terminal command
const url =
    `mongodb+srv://testUser2:${password}@cluster0.kfliw.mongodb.net/phonebook-app?retryWrites=true&w=majority`

//Connect to mongo and create the phonebook-app database using the url above  
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

//Mongoose schema for adding people
const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
    id: Number,
})

//Model for people using the personSchema
const Person = mongoose.model('Person', personSchema)


//If there are anough arguments, we create a new instance of
//Person using args
if (process.argv.length === 5) {

    //generating an id, prob. non-unique :(
    var id = generateId()

    const person = new Person({
        name: process.argv[3],
        phone: process.argv[4],
        id: id,
    })

    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })

} else if (process.argv.length === 3) {

    Person.find({}).then(result => {
        console.log(`phonebook:`)
        result.forEach(person => {
            console.log(`${person.name} ${person.phone}`)
        })
        mongoose.connection.close()
    })

}


