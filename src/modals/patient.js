const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const patient_Schema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    address: {
        type: String,
        trim: true,
        minlength: 10,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 15,
        trim: true,
    },
    phone: {
        type: Number,
    },
    photo: {
        type: Buffer
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Psychiatrist'
    }

})


patient_Schema.pre('save', async function (next) {
    const patient = this

    if (patient.isModified('password')) {
        patient.password = await bcrypt.hash(patient.password, 8)
    }

    next()
})


module.exports = mongoose.model('patient', patient_Schema)
