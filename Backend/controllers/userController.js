const userModel = require('../models/userModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const bcrypt = require('bcrypt');
const sendToken = require('../utils/jwtToken');
const nodemailer = require('nodemailer');


// Register User
const registerUser = catchAsyncErrors(async (req, res, next) => {

  const { name, email, password } = req.body;

  const bpass = await bcrypt.hash(password, 12);

  const user = await userModel.create({
    name,
    email,
    password: bpass,
    avatar: {
      public_id: "This is a sample id",
      url: "profilepicUrl"
    }
  })

  sendToken(user, 201, res);

})

// Login User

const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400))
  }

  const user = await userModel.findOne({ email: email });
  // console.log(user);

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  // console.log(isPasswordMatch);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Inavalid email or password", 401));
  }

  sendToken(user, 200, res);
})


// Logout User

const logoutUser = catchAsyncErrors(async (req, res, next) => {

  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: "Logged Out"
  })
})

//Send OTP Api
const sendOTP = catchAsyncErrors(async (req, res, next) => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  const { email } = req.body;
  // console.log(email);
  const user = await userModel.findOne({ email: email });
  console.log(user);

  if (!user) {
    return next(new ErrorHandler("User not Found", 404
    ))
  }

  const saveOTP = await userModel.findByIdAndUpdate({ _id: user._id }, { Otp: otp }, { new: true });

  const transporter = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ujasbaravaliya4411@gmail.com',
      pass: process.env.PASS
    }
  });

  const mailOptions = {
    from: 'ujasbaravaliya4411@gmail.com',
    to: email,
    subject: 'Forgot Password OTP',
    text: String(otp),
    html: `<h1>Welcome</h1><p>${otp}</p>`
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).json({
        success: false,
        Message: "Somthing went wrong"
      });
    } else {
      res.status(200).json({
        success: true,
        Message: "Otp send", info, saveOTP
      });
    }
  });
});


// Verify/Submit OTP Api
const submitOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email: email });
  // console.log(user);

  if (!user) {
    return next(new ErrorHandler("User not Found", 404
    ))
  }

  if (user.Otp === otp) {
    res.status(200).json({
      success: true,
      message: "OTP verified"
    })
  } else {
    return next(new ErrorHandler("OTP Not Matched.", 401));
  }
})

// Reset Password Api
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const user = await userModel.findOne({ email: email });
  console.log(user);

  if (!user) {
    return next(new ErrorHandler("User not Found", 404
    ))
  }

  const bpass = await bcrypt.hash(newPassword, 12);

  const updatePassword = await userModel.findByIdAndUpdate({ _id: user._id }, { password: bpass }, { new: true });

  if (updatePassword) {
    res.status(200).json({
      success: true,
      message: "Password Updated Successfully!"
    })
  } else {
    return next(new ErrorHandler("Password Not Updated", 401));
  }
});

//Get User Details
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User Details Fetched Successfully!",
    user
  })
})

// Update User Password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { password } = req.body;

  const bpass = await bcrypt.hash(password, 12);

  const passwordUpdate = await userModel.findByIdAndUpdate({ _id: req.params.id }, { password: bpass }, { new: true });

  res.status(200).json({
    success: true,
    message: "Password Updated Successfully!",
    passwordUpdate
  })
})

//Update user
const updateUser = async (req, res) => {
  const user = await userModel.updateOne({ _id: req.params.id }, {
    name: req.body.name,
    email: req.body.email
  })

  res.status(200).json({
    success: true,
    message: "User Updated Successfully!",
    user
  })
}

// Get All User
const getAllUser = async (req, res) => {
  const user = await userModel.find();

  res.status(200).json({
    success: true,
    message: "All User Find",
    user
  })
}

//Get Single User
const getSingleUser = async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exists with Id:${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    user
  })
}

// Update User Role
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await userModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    success: true
  });
});



//Delete User
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});


module.exports = { registerUser, loginUser, logoutUser, sendOTP, submitOTP, resetPassword, getUserDetails, updatePassword, updateUser, getAllUser, getSingleUser, updateUserRole, deleteUser }