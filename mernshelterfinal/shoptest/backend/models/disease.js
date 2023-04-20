const mongoose = require('mongoose')

const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter disease/injury name'],
        trim: true,
        maxLength: [100, 'Disease/Injury name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter disease/injury description'],
    },
    position: {
        type: String,
        required: [true, 'Please select position'],
        enum: {
            values: [
                'Disease',
                'Injury'
            ],
            message: 'Please choose appropriately'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Disease', diseaseSchema);