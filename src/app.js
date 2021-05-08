require('./db/mongoose')
const express = require('express')
const app = express()
const psychiatrist_router = require('./routes/psychiatrist')
const patient_router = require('./routes/patient')

//PORT
const port = process.env.PORT || 8000
app.use(express.json())
app.use(psychiatrist_router)
app.use(patient_router)



const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })
    console.log(token)

    const data = jwt.verify(token, 'thisismynewcourse')
    console.log(data)
}
//myFunction()

//starting A Server
app.listen(port, () => {
    console.log(`app is running at port ${port} `)
});
