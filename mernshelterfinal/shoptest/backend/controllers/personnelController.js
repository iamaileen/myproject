const Personnel = require('../models/personnel')
const ErrorHandler = require('../utils/errorHandler')
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary');



exports.getPersonnels = async (req,res,next) => {
	// const personnel = await Product.find();
	const resPerPage = 4;
	const personnelCount = await Personnel.countDocuments();

	const apiFeatures = new APIFeatures(Personnel.find(),req.query).search().filter();

	apiFeatures.pagination(resPerPage);
	const personnel = await apiFeatures.query;
	let filteredPersonnelCount = personnel.length;

	if(!personnel) {
	 		return next(new ErrorHandler('Personnel not found',404));
	 }
	res.status(200).json({
		success: true,
		personnelCount,
		filteredPersonnelCount,
		resPerPage,
		personnel
	})
	
}

exports.getSinglePersonnel = async(req,res,next) => {
	 const personnel = await Personnel.findById(req.params.id);
	 
	 if(!personnel) {
	 		return next(new ErrorHandler('Personnel not found',404));
	 }
	 res.status(200).json({
	 	success: true,
	 	personnel
	 })
}


exports.updatePersonnel = catchAsyncErrors(async (req, res, next) => {

    let personnel = await Personnel.findById(req.params.id);

    if (!personnel) {
        return next(new ErrorHandler('Personnel not found', 404));
    }
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
    if (images !== undefined) {
        // Deleting images associated with the personnel
        for (let i = 0; i < personnel.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(personnel.images[i].public_id)
        }
        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'personnels'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLinks
    }

    personnel = await Personnel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        personnel
    })

})
exports.deletePersonnel = async (req,res,next) =>{
	const personnel = await Personnel.findById(req.params.id);
	if(!personnel) {
	 		return res.status(404).json({
	 			success: false,
	 			message: 'Personnel not found'
	 		})
	 }
	 await personnel.remove();
	 res.status(200).json({
	 	success: true,
	 	message: 'Personnel deleted'
	 })
}

// exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

//     const { rating, comment, productId } = req.body;

//     const review = {
//         user: req.user._id,
//         name: req.user.name,
//         rating: Number(rating),
//         comment
//     }

//     const product = await Product.findById(productId);

//     const isReviewed = product.reviews.find(
//         r => r.user.toString() === req.user._id.toString()
//     )

//     if (isReviewed) {
//         product.reviews.forEach(review => {
//             if (review.user.toString() === req.user._id.toString()) {
//                 review.comment = comment;
//                 review.rating = rating;
//             }
//         })

//     } else {
//         product.reviews.push(review);
//         product.numOfReviews = product.reviews.length
//     }

//     product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

//     await product.save({ validateBeforeSave: false });

//     res.status(200).json({
//         success: true
//     })

// })



// // Get Product Reviews   =>   /api/v1/reviews
// exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
//     const product = await Product.findById(req.query.id);

//     res.status(200).json({
//         success: true,
//         reviews: product.reviews
//     })
// })

// // Delete Product Review   =>   /api/v1/reviews
// exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
//     const product = await Product.findById(req.query.productId);

//     console.log(req);

//     const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

//     const numOfReviews = reviews.length;

//     const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

//     await Product.findByIdAndUpdate(req.query.productId, {
//         reviews,
//         ratings,
//         numOfReviews
//     }, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false
//     })

//     res.status(200).json({
//         success: true
//     })
// })

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminPersonnels = catchAsyncErrors(async (req, res, next) => {

    const personnel = await Personnel.find();

    res.status(200).json({
        success: true,
        personnel
    })

})

exports.newPersonnel = catchAsyncErrors(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'personnel'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const personnel = await Personnel.create(req.body);

    res.status(201).json({
        success: true,
        personnel
    })
})
