const mongoose = require('mongoose')

const animalSchema = new mongoose.Schema({
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    name: {
        type: String,
        required: [true, 'Please enter animal name'],
        trim: true,
        maxLength: [100, 'Exceed 100 characters']
    },

    breed: {
        type: String,
        required: [true, 'Please enter animal breed'],
        trim: true,
        maxLength: [100, 'Exceed 100 characters']
    },

    type: {
        type: String,
        required: [true, 'Please enter animal type'],
        trim: true,
        maxLength: [100, 'Exceed 100 characters']
    },

    gender: {
        type: String,
        required: [true, 'Please enter animal gender'],
        trim: true,
        maxLength: [100, 'Exceed 100 characters']
    },

    age: {
        type: Number,
        required: [true, 'Please enter animal age'],
        default: 0.0
    },

    date_rescued: {
        type: Date,
        required: [true, 'Please enter rescue date'],
        trim: true,
    },

    status: {
        type: String,
        trim: true,
    },
        

    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],

    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'User',
    //     required: true
    // },

})

module.exports = mongoose.model('Animals', animalSchema);
