const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Patient=require('./patient')

const psychiatrists_Schema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    hospital_name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
    },
    phone_no: {
        type: Number,

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
        trim: true
    },
    pincode: {
        type: Number,
    },
    state: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            //required: true
        }
    }]
}, {
    timestamps: true
})


psychiatrists_Schema.virtual('patient', {
    ref: 'Patient',
    localField: '_id',
    foreignField: 'owner'
})


psychiatrists_Schema.methods.toJSON = function () {
    const psychiatrist = this
    const psychiatristObject = psychiatrist.toObject()

    delete psychiatristObject.password
    delete psychiatristObject.tokens

    return psychiatristObject
}

psychiatrists_Schema.methods.generateAuthToken = async function () {
    const psychiatrists = this
    const token = jwt.sign({ _id: psychiatrists._id.toString() }, 'thisismynewcourse')
    psychiatrists.tokens = psychiatrists.tokens.concat({ token })
    await psychiatrists.save()
    return token
}


psychiatrists_Schema.pre('save', async function (next) {
    const psychiatrists = this

    if (psychiatrists.isModified('password')) {
        psychiatrists.password = await bcrypt.hash(psychiatrists.password, 8)
    }

    next()
})


psychiatrists_Schema.statics.findByCredentials = async (email, password) => {
    const psychiatrists = await Psychiatrists.findOne({ email })

    if (!psychiatrists) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, psychiatrists.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return psychiatrists
}

const Psychiatrists = mongoose.model('Psychiatrists', psychiatrists_Schema)

module.exports = Psychiatrists

