import User from '../models/userModel.js';

export const getAllUsers = async (req , res) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
            users
        }
    });
}
export const createUser = async (req , res) => {
    const newUser = await User.create({
        name: req.body.name,  
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    newUser.password = undefined;
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
}
export const getUser = async (req , res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({  
        status: 'success',
        data: {
            user
        }
    });
}
export const updateUser = async (req , res) => {        
    const user = await User.findByIdAndUpdate(req.params.id , {name: req.body.name, email: req.body.email} , {
        new: true,
        runValidators: true 
    });
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
}
export const deleteUser = async (req , res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
}