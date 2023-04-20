const ErrorHandler = require('../utils/errorHandler')
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary');
const Animal = require('../models/animal')


exports.getAnimals = async (req,res,next) => {
    // const products = await Product.find();
    const resPerPage = 4;
    const animalsCount = await Animal.countDocuments();

    const apiFeatures = new APIFeatures(Animal.find(),req.query).search().filter();

    apiFeatures.pagination(resPerPage);
    const animals = await apiFeatures.query;
    let filteredAnimalsCount = animals.length;

    // console.log(animalsCount)
    // console.log(filteredAnimalsCount)

    if(!animals) {
            return next(new ErrorHandler('Animal not found',404));
     }
    res.status(200).json({
        success: true,
        animalsCount,
        filteredAnimalsCount,
        resPerPage,
        animals
    })
    
}

// Admin
exports.getAdminAnimals = catchAsyncErrors(async (req, res, next) => {

    const animals = await Animal.find();

    res.status(200).json({
        success: true,
        animals
    })

})

exports.getAnimalStatus = catchAsyncErrors(async (req, res, next) => {

    const animal = await Animal.findById(req.query.id);

    res.status(200).json({
        success: true,
        status: animal.status
    })
})

exports.getAnimalDetails = async (req, res, next) => {
    const animal = await Animal.findById(req.params.id);

    if (!animal) {
        return next(new ErrorHandler(`Animal does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        animal
    })
}


exports.newAnimal = catchAsyncErrors(async (req, res, next) => {

    console.log(req.body.images)
    // for images
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'animals'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    // req.body.user = req.user.id;
    
    const animal = await Animal.create(req.body);


    res.status(201).json({
        success: true,
        animal
    })
})

exports.updateAnimal = catchAsyncErrors(async (req, res, next) => {

    let animal = await Animal.findById(req.params.id);

    console.log(animal.status)

    if (!animal) {
        return next(new ErrorHandler('Animal not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
    if (images !== undefined) {
        // Deleting images associated with the animal
        for (let i = 0; i < animal.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(animal.images[i].public_id)
        }
        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'animals'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLinks
    }

    animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        animal
    })

})

exports.deleteAnimal = async (req,res,next) =>{
    const animal = await Animal.findById(req.params.id);
    if(!animal) {
            return res.status(404).json({
                success: false,
                message: 'Animal not found'
            })
     }
     await animal.remove();
     res.status(200).json({
        success: true,
        message: 'Animal deleted'
     })
}


// Animal Comment
exports.createAnimalReview = catchAsyncErrors(async (req, res, next) => {

    const {comment, animalID } = req.body;

    console.log(comment)
    const review = {
        user: req.user._id,
        name: req.user.name,
        comment
    }

    const animal = await Animal.findById(animalID);

    const isReviewed = animal.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        animal.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
            }
        })

    } else {
        animal.reviews.push(review);
        animal.numOfReviews = animal.reviews.length
    }


    await animal.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})