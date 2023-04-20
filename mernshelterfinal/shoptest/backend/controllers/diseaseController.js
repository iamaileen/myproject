const Disease = require('../models/disease')
const ErrorHandler = require('../utils/errorHandler')
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
// const cloudinary = require('cloudinary');



exports.getDiseases = async (req,res,next) => {
	// const disease = await Disease.find();
	const resPerPage = 4;
	const diseaseCount = await Disease.countDocuments();

	const apiFeatures = new APIFeatures(Disease.find(),req.query).search().filter();

	apiFeatures.pagination(resPerPage);
	const disease = await apiFeatures.query;
	let filteredDiseaseCount = disease.length;

	if(!disease) {
	 		return next(new ErrorHandler('Disease not found',404));
	 }
	res.status(200).json({
		success: true,
		diseaseCount,
		filteredDiseaseCount,
		resPerPage,
		disease
	})
	
}

exports.getSingleDisease = async(req,res,next) => {
	 const disease = await Disease.findById(req.params.id);
	 
	 if(!disease) {
	 		return next(new ErrorHandler('Disease not found',404));
	 }
	 res.status(200).json({
	 	success: true,
	 	disease
	 })
}


exports.updateDisease = catchAsyncErrors(async (req, res, next) => {

    let disease = await Disease.findById(req.params.id);

    if (!disease) {
        return next(new ErrorHandler('Disease not found', 404));
    }
    // let images = []
    // if (typeof req.body.images === 'string') {
    //     images.push(req.body.images)
    // } else {
    //     images = req.body.images
    // }
    // if (images !== undefined) {
    //     // Deleting images associated with the disease
    //     for (let i = 0; i < disease.images.length; i++) {
    //         const result = await cloudinary.v2.uploader.destroy(disease.images[i].public_id)
    //     }
    //     let imagesLinks = [];
    //     for (let i = 0; i < images.length; i++) {
    //         const result = await cloudinary.v2.uploader.upload(images[i], {
    //             folder: 'diseases'
    //         });

    //         imagesLinks.push({
    //             public_id: result.public_id,
    //             url: result.secure_url
    //         })
    //     }
    //     req.body.images = imagesLinks
    // }

    disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        disease
    })

})

exports.deleteDisease = async (req,res,next) =>{
	const disease = await Disease.findById(req.params.id);
	if(!disease) {
	 		return res.status(404).json({
	 			success: false,
	 			message: 'Disease not found'
	 		})
	 }
	 await disease.remove();
	 res.status(200).json({
	 	success: true,
	 	message: 'Disease deleted'
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

// Get all diseases (Admin)  =>   /api/v1/admin/diseases
exports.getAdminDiseases = catchAsyncErrors(async (req, res, next) => {

    const disease = await Disease.find();

    res.status(200).json({
        success: true,
        disease
    })

})

exports.newDisease = catchAsyncErrors(async (req, res, next) => {

    // let images = []
    // if (typeof req.body.images === 'string') {
    //     images.push(req.body.images)
    // } else {
    //     images = req.body.images
    // }

    // let imagesLinks = [];

    // for (let i = 0; i < images.length; i++) {
    //     const result = await cloudinary.v2.uploader.upload(images[i], {
    //         folder: 'disease'
    //     });

    //     imagesLinks.push({
    //         public_id: result.public_id,
    //         url: result.secure_url
    //     })
    // }

    // req.body.images = imagesLinks
    // req.body.user = req.user.id;

    const disease = await Disease.create(req.body);

    res.status(201).json({
        success: true,
        disease
    })
})
