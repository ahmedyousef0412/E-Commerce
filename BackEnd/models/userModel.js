const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    max: 25,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    max: 1024,
  },
  role:{
    type:String,
    default:"user"
  }
});

userSchema.pre("save",async function(next){
       const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (!update.password) {
   
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  update.password = await bcrypt.hash(update.password, salt);
  next();
});


userSchema.methods.isPasswordMatched = async function(passwordEntered){
  return await bcrypt.compare(passwordEntered ,this.password)
};

const User = mongoose.model('User',userSchema);

function validateUser(user) {

    const schema = Joi.object({
        firstName: Joi.string().min(3).max(25).required(),
        lastName: Joi.string().min(5).max(50).required(),
        mobile:Joi.string().min(11).max(11),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(1024).required().trim()
    });

    return schema.validate(user, { abortEarly: false });
}
function validateUserLogin(user) {

  const schema = Joi.object({
     
      email: Joi.string().required().email(),
      password: Joi.string().min(8).max(1024).required().trim()
  });

  return schema.validate(user, { abortEarly: false });
}

function handleValidationErrors(error, res) {
  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateLogin = validateUserLogin;
exports.handleError = handleValidationErrors;