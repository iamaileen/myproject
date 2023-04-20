const mongoose = require('mongoose')

const adoptionSchema = mongoose.Schema({
    adoptionInfo: {
        occupation: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    animalInfo: [
        {
            name: {
                type: String,
                required: true
            },
            category: {
                type: String,
                required: true,
                enum: {
                    values: [
                        'Dogs',
                        'Cats'
                    ],
                }
            },
            breed: {
                type: String,
                required: true
            },
            age: {
                type: Number,
                required: true
            },
            gender: {
                type: String,
                required: true
            },
            rescued: {
                type: Date,
                required: true
            },
            images: {
                type: String,
                required: true
            },
            animal: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Animal'
            }
        }
    ],
    validationInfo: {
        id: {
            type: String
        },
        status: {
            type: String
        }
    },
    adoptedAt: {
        type: Date
    },
    adoptStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Adoption', adoptionSchema)

