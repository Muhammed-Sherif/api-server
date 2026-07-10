import {Schema, model} from 'mongoose';
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type : String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});
// middleware to hash password before saving to the database if only the password field is modified
userSchema.pre('save', async function ()  {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

userSchema.pre('/^find/', function(next) {
    this.find({ active: {$ne: false}});
    next();
});

// add a method to the user schema to check if the provided password is correct
userSchema.methods.correctPassword = async (candidatePassword, userPassword) => await bcrypt.compare(candidatePassword, userPassword);
// add a method to the user schema to check if the password was changed after the token was issued
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return jwtTimestamp < changedTimestamp;
    }
    return false;
};
export default model('User', userSchema);