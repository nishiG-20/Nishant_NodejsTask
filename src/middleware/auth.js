const jwt = require('jsonwebtoken')
const Psychiatrist = require('../modals/psychiatrist')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const psychiatrist = await Psychiatrist.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!psychiatrist) {
            throw new Error()
        }
        req.token = token
        req.psychiatrist = psychiatrist
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}
module.exports = auth



