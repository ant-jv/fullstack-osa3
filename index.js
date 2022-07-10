require('dotenv').config()
const express = require('express')
const { token } = require('morgan')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))

app.use(cors())

app.use(express.json())

morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.content(req, res)
    ].join(' ')
  }))

let persons = [
    {
      "name": "Testi Testinen",
      "number": "1234",
      "id": 1
    },
    {
        "name": "Esimerkki Esimerkkinen",
        "number": "1234",
        "id": 2
    }
]



app.get('/api/persons', (request, response) => {
    Person.find().then( people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.type('text/plain')
    const message = 'Phonebook has info for ' + persons.length + ' people.\n' + Date()
    response.send(message)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ 
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing'
        })
    } else if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'already exits'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})