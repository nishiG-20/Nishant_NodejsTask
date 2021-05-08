const mongoose = require('mongoose')

//DB Connections
mongoose.connect('mongodb://127.0.0.1:27017/Hospital',
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
).then((data) => {
    console.log('Database Connected')
})