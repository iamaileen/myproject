const Adoption = require('../models/adoption');
const Animal = require('../models/animal');

const ErrorHandler = require('../utils/errorHandler');

exports.newAdopt = async (req, res, next) => {
    const {
        adoptionInfo,
        animalInfo,
        validationInfo

    } = req.body;

    const adoption = await Adoption.create({
        adoptionInfo,
        animalInfo,
        validationInfo,
        adoptedAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        adoption
    })
}

// // Get single order   =>   /api/v1/order/:id
// exports.getSingleOrder = async (req, res, next) => {
//     const order = await Order.findById(req.params.id).populate('user', 'name email')

//     if (!order) {
//         return next(new ErrorHandler('No Order found with this ID', 404))
//     }

//     res.status(200).json({
//         success: true,
//         order
//     })
// }

// // Get logged in user orders   =>   /api/v1/orders/me
// exports.myOrders = async (req, res, next) => {
//     const orders = await Order.find({ user: req.user.id })
// // console.log(req.user)
//     res.status(200).json({
//         success: true,
//         orders
//     })
// }

// // Get all orders - ADMIN  =>   /api/v1/admin/orders/
// exports.allOrders = async (req, res, next) => {
//     const orders = await Order.find()
//     // console.log(orders)
//     let totalAmount = 0;

//     orders.forEach(order => {

//         totalAmount += order.totalPrice
//     })

//     res.status(200).json({
//         success: true,
//         totalAmount,
//         orders
//     })
// }

// // Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
// exports.updateOrder = async (req, res, next) => {
//     const order = await Order.findById(req.params.id)

//     if (order.orderStatus === 'Delivered') {
//         return next(new ErrorHandler('You have already delivered this order', 400))
//     }

//     order.orderItems.forEach(async item => {
//         await updateStock(item.product, item.quantity)
//     })

//     order.orderStatus = req.body.status,
//         order.deliveredAt = Date.now()

//     await order.save()

//     res.status(200).json({
//         success: true,
//     })
// }

// async function updateStock(id, quantity) {
//     const product = await Product.findById(id);

//     product.stock = product.stock - quantity;

//     await product.save({ validateBeforeSave: false })
// }

// // Delete order   =>   /api/v1/admin/order/:id
// exports.deleteOrder = async (req, res, next) => {
//     const order = await Order.findById(req.params.id)

//     if (!order) {
//         return next(new ErrorHandler('No Order found with this ID', 404))
//     }

//     await order.remove()

//     res.status(200).json({
//         success: true
//     })
// }