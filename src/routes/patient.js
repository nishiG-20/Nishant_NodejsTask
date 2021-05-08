const express = require('express')
const Patient = require('../modals/patient')
const auth= require('../middleware/auth')
const multer= require('multer')

const router = new express.Router()

//Create Patient
router.post('/patient', auth,async (req, res) => {
    const patient = new Patient({
        ...req.body,
        owner: req. psychiatrist._id
    })
    try {
        await patient.save()
        res.status(201).send(patient)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Read patient By Id
router.get('/patient/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const patient = await Patient.findById(_id)

        if (!patient) {
            return res.status(404).send()
        }

        res.send(patient)
    } catch (e) {
        res.status(500).send()
    }
})

//Update Patient BY Id
router.patch('/patient/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','address','email','phone','password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!patient) {
            return res.status(404).send()
        }

        res.send(patient)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete Patient By Id
router.delete('/patient/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id)

        if (!patient) {
            return res.status(404).send()
        }

        res.send(patient)
    } catch (e) {
        res.status(500).send()
    }
})


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/patient/me/photo', auth, upload.single('photo'), async (req, res) => {
    req.patient.photo = req.file.buffer
    await req.patient.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



module.exports = router