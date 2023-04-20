const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    
    const result = await cloudinary.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    }, (err, res) => {
          console.log(err, res);
      });
    console.log(result);
    const { name, email, password, address, contact } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        address,
        contact,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
           
        }
    })

    sendToken(user, 200, res)

})

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')
    // console.log(user)
    const stat = user.status

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    if (stat === 'active')
    {
        sendToken(user, 200, res)
    }
    
    if (stat === 'inactive')
    {
        return next(new ErrorHandler('Account disabled', 401));
    }
    
}

exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}

exports.forgotPassword = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `<p>Your password reset token is as follow:\n\n<a href="${resetUrl}">Reset Password</a>\n\nIf you have not requested this email, then ignore it.</p>`
    const html =  `<p>Your password reset token is as follow:\n\n<a href="${resetUrl}">Reset Password</a>\n\nIf you have not requested this email, then ignore it.</p>`
    try {

        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message,
            html
             
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

}

// Reset Password   =>  /api/v1/password/reset/:token
exports.resetPassword = async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

}

exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
}

exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect'));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)

}

// Update user profile   =>   /api/v1/me/update
exports.updateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        address: req.body.address,
        contact: req.body.contact,
        email: req.body.email
    }

    // Update avatar
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.uploader.destroy(image_id);

        const result = await cloudinary.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        // useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
}

// Get all users   =>   /api/v1/admin/users
exports.allUsers = async (req, res, next) => {
    const users = await User.find({role:'user'});

    res.status(200).json({
        success: true,
        users
    })
}

// Get user details   =>   /api/v1/admin/user/:id
exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
}

// Get update user details   =>   /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    // console.log(req.params.id)
    // if Personnel => Update
    if (user.role === 'admin')
    {
        const newUserData = {
            name: req.body.name,
            address: req.body.address,
            contact: req.body.contact,
            category: req.body.category,
            email: req.body.email,
            status: 'active',
        }

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            
        })
    }

    // if Adopter => Update
    if (user.role === 'user')
    {
        if (user.status === 'active')
        {
            const newUserData = {
                    name: req.body.name,
                    address: req.body.address,
                    contact: req.body.contact,
                    category: req.body.category,
                    email: req.body.email,
                    status: 'inactive',
                }

                const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
                    new: true,
                    runValidators: true,
                    
                })
        }

        if (user.status === 'inactive')
        {
            const newUserData = {
                name: req.body.name,
                address: req.body.address,
                contact: req.body.contact,
                category: req.body.category,
                email: req.body.email,
                status: 'active',
            }

            const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
                new: true,
                runValidators: true,
                
            }) 
        }
    }
    

    res.status(200).json({
    success: true
            
    })
})

// Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

  
    await user.remove();

    res.status(200).json({
        success: true,
    })
})

// Get Personnels
exports.getPersonnels = async (req, res, next) => {
    const users = await User.find({role:'admin'});
    // console.log(users)
    res.status(200).json({
        success: true,
        users
    })
}


// Create new Personnel
exports.newPersonnel = catchAsyncErrors(async (req, res, next) => {
    
    const result = await cloudinary.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    }, (err, res) => {
          console.log(err, res);
      });
    
    const { name, email, password, category, role, address, contact, status } = req.body;

    const user = await User.create({
        name,
        address,
        contact,
        email,
        password,
        category,
        role,
        status,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
           
        }
    })

    console.log(user);

    res.status(201).json({
        success: true,
        user
    })

})

