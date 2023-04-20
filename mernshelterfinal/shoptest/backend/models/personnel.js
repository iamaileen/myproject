const mongoose = require('mongoose')

const personnelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter personnel name'],
        trim: true,
        maxLength: [100, 'Personnel name cannot exceed 100 characters']
    },
    age: {
        type: Number,
        required: [true, 'Please enter personnel age'],
        maxLength: [3, 'Personnel age cannot exceed 3 characters'],
        default: 0.0
    },
    gender: {
        type: String,
        required: [true, 'Please enter personnel gender'],
        enum: {
            values:[
                'Male',
                'Female'
            ],
        },
        maxLength: [6, 'Personnel gender cannot exceed 6 characters'],

    },
    phone: {
        type: String,
        required: [true, 'Please enter personnel phone number'],
        trim: true,
        maxLength: [11, 'Personnel phone number cannot exceed 11 characters']
    },
    pimages: [
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
    address: {
        type: String,
        required: [true, 'Please enter personnel address'],
        trim: true,
        maxLength: [120, 'Personnel address cannot exceed 120 characters']
    },
    position: {
            type: String,
            required: [true, 'Please select personnel position'],
            enum: {
                values: [
                    'Employee',
                    'Veterinarian',
                    'Volunteer'
                ],
                message: 'Please select correct position for personnel'
            }
        },
    // category: {
    //     type: String,
    //     required: [true, 'Please select category for this product'],
    //     enum: {
    //         values: [
    //             'Electronics',
    //             'Cameras',
    //             'Laptops',
    //             'Accessories',
    //             'Headphones',
    //             'Food',
    //             "Books",
    //             'Clothes/Shoes',
    //             'Beauty/Health',
    //             'Sports',
    //             'Outdoor',
    //             'Home'
    //         ],
    //         message: 'Please select correct category for product'
    //     }
    // },
    // seller: {
    //     type: String,
    //     required: [true, 'Please enter product seller']
    // },
    // stock: {
    //     type: Number,
    //     required: [true, 'Please enter product stock'],
    //     maxLength: [5, 'Product name cannot exceed 5 characters'],
    //     default: 0
    // },
    // numOfReviews: {
    //     type: Number,
    //     default: 0
    // },
    // reviews: [
    //     {
    //         user: {
    //             type: mongoose.Schema.ObjectId,
    //             ref: 'User',
    //             required: true
    //         },
    //         name: {
    //             type: String,
    //             required: true
    //         },
    //         rating: {
    //             type: Number,
    //             required: true
    //         },
    //         comment: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Personnel', personnelSchema);