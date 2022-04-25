// if (process.argv.length < 3) {
//     console.log('Please provide the password as an argument: node mongo.js <password>')
// }

// const password = process.argv[2]

// const url = `mongodb+srv://nas11ai:cvIfvmHIc9pZuxV9@cluster0.jap1z.mongodb.net/noteApp?retryWrites=true&w=majority`

// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//     content: String,
//     date: Date,
//     important: Boolean
// })

// const Note = mongoose.model('Note', noteSchema)

// noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString();
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')

// let notes = [
//     {
//         id: 1,
//         content: "HTML is easy",
//         date: "2022-01-10T17:30:31.098Z",
//         important: true
//     },
//     {
//         id: 2,
//         content: "Browser can execute only Javascript",
//         date: "2022-01-10T18:39:34.091Z",
//         important: false
//     },
//     {
//         id: 3,
//         content: "GET and POST are the most important methods of HTTP protocol",
//         date: "2022-01-10T19:20:14.298Z",
//         important: true
//     }
// ]

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(obj => obj.id)) : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    })

    note.save()
        .then(savedNote => response.json(savedNote))
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

// app.delete('/api/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     notes = notes.filter(note => note.id !== id)

//     response.status(204).end()
// })

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id).then(note => {
        response.json(note)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})