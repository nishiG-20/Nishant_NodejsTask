const express = require('express')
const Psychiatrist = require('../modals/psychiatrist')
const auth = require('../middleware/auth')

const router = new express.Router()

//Create psychiatrist
router.post('/psychiatrist', async (req, res) => {
    const psychiatrist = new Psychiatrist(req.body)
    try {
        await psychiatrist.save()
        const token = await psychiatrist.generateAuthToken()
        res.status(201).send({ psychiatrist, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//Login psychiatrist

router.post('/psychiatrist/login', async (req, res) => {
    try {
        const psychiatrist = await Psychiatrist.findByCredentials(req.body.email, req.body.password)
        const token = await psychiatrist.generateAuthToken()
        res.send({ psychiatrist, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

//Logout psychiatrist
router.post('/psychiatrist/logout', auth, async (req, res) => {
    try {
        req.psychiatrist.tokens = req.psychiatrist.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.psychiatrist.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Logout All
router.post('/psychiatrist/logoutAll', auth, async (req, res) => {
    try {
        req.psychiatrist.tokens = []
        await req.psychiatrist.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//find psychiatrist by id
router.get('/psychiatrist/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const psychiatrist = await Psychiatrist.findById(_id)

        if (!psychiatrist) {
            return res.status(404).send()
        }

        res.send(psychiatrist)
    } catch (e) {
        res.status(500).send()
    }
})

//Read Psychiatrist
router.get('/readProfile', auth, async (req, res) => {
    res.send(req.psychiatrist)
})

//Update psychiatrist by Id
router.patch('/psychiatrist/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['first_name', 'last_name', 'hospital_name', 'phone_no', 'pincode', 'state']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const psychiatrist = await Psychiatrist.findById(req.params.id)

        updates.forEach((update) => psychiatrist[update] = req.body[update])
        await psychiatrist.save()

        if (!psychiatrist) {
            return res.status(404).send()
        }

        res.send(psychiatrist)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete psychiatrist By Id
router.delete('/psychiatrist/:id', async (req, res) => {
    try {
        const psychiatrist = await Psychiatrist.findByIdAndDelete(req.params.id)

        if (!psychiatrist) {
            return res.status(404).send()
        }

        res.send(psychiatrist)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router