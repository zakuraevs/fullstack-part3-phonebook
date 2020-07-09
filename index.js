const express = require('express')
const app = express()

app.use(express.json())

let persons = [
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
]

//TITEL PAGE
app.get('/', (req, res) => {
    res.send('<h1>Hello World <3</h1>')
})

//ALL PERSONS
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//INFO PAGE
app.get('/info', (req, res) => {

    res.send(`<div>Phonebook has info for ${persons.length} people</div>
    <br>
    <div>${new Date()}</div>`)
})

//SPECIFIC PERSON BY ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    //const note = notes.find(note => note.id === id)
    const person = persons.find(p => {
        console.log(p.id, typeof p.id, id, typeof id, p.id === id)
        return p.id === id
    })
    console.log(person)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

//DELETE SPECIFIC PERSON BY ID
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

//ADD NEW PERSON
app.post('/api/persons', (request, response) => {

    const body = request.body
    console.log(body)

    if (!body.name || !body.number ) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    var id =  generateId()
    while(persons.map(p => p.id).includes(id)) id = generateId()

    const note = {
        name: body.name,
        number: body.number,
        id: id,
    }

    persons = persons.concat(note)

    response.json(note)

})




//HELPER FUNCTIONS

//WILL NOT WORK IF OUT OF IDS
const generateId = () => {
    const max = 10000
    return Math.floor(Math.random() * max)
}


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
