const mongoose = require('mongoose')

const healthSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter injury/disease name'],
        trim: true,
        maxLength: [100, 'Injury/disease cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Please enter category'],
    },
    description: {
        type: String,
        required: [true, 'Please enter injury/disease description'],
    },
})

module.exports = mongoose.model('Healths', healthSchema);
