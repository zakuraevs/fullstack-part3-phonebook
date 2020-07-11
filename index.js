require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
var morgan = require('morgan')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('pdata', function (req) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :pdata '))

/*let persons = [
    {
        "name": "Arto Hellas",
        "number": "222",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]*/

//TITLE PAGE
app.get('/', (req, res) => {
    res.send('<h1>Hello World <3</h1>')
})

//ALL PERSONS
app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

//INFO PAGE
//DOESNT WORK
app.get('/info', (req, res) => {

    res.send(`<div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>${new Date()}</div>`)
})

//SPECIFIC PERSON BY ID
/*app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //const note = notes.find(note => note.id === id)
    const person = persons.find(p => {
        return p.id === id
    })

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})*/
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

//DELETE SPECIFIC PERSON BY ID
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

//ADD NEW PERSON
/*app.post('/api/persons', (request, response) => {

    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.map(p => p.name).includes(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    var id = generateId()
    while (persons.map(p => p.id).includes(id)) id = generateId()

    const note = {
        name: body.name,
        number: body.number,
        id: id,
    }

    persons = persons.concat(note)

    response.json(note)

})*/
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const person = new Person({
        name: body.name,
        phone: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })


//MIDDLEWARE
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)




//HELPER FUNCTIONS

//WILL NOT WORK IF OUT OF IDS
const generateId = () => {
    const max = 10000
    return Math.floor(Math.random() * max)
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
