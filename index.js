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

app.get('/api/persons', (request, response) => {
    Person.find().then( people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.find().then( people => {
        response.type('text/plain')
        const message = 'Phonebook has infoa for ' + people.length + ' people.\n' + Date()
        response.send(message)
    })
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



app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
  
    const person = new Person({
        name: body.name,
        number: body.number,
        id: body.id
    })
  
    Note.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPeson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})




const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})