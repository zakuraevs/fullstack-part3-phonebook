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

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

morgan.token('pdata', function (req) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :pdata '))

//TITLE PAGE
app.get('/', (req, res) => {
    res.send('<h1>Phonebook app <3</h1>')
})

//ALL PERSONS
app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

//INFO PAGE 
app.get('/info', (req, res) => {
    let numOfEntries = 0

    Person.countDocuments({}).then(count => {
        res.send(`<div>Phonebook has info for ${count} people</div>
        <br>
        <div>${new Date()}</div>`)
      })
    
})

//GET SPECIFIC PERSON BY ID
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        console.log("DANGGG, NO SUCH PERSON FOUND IN DATABASE")
        response.status(404).end() 
      }
    })
    .catch(error => next(error))
})

//ADD NEW PERSON
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        phone: body.number,
    })

    person.save()
    .then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

//DELETE SPECIFIC PERSON BY ID
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
        name: body.name,
        phone: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })


//MIDDLEWARE
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.log(error.name)
    console.log("DANGGG, BAD REQUEST")
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(409).send({ error: 'Mongoose validation failed. Probably name already exists or params too short' })
    }
  
    next(error)
  }
  
  app.use(errorHandler)


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
