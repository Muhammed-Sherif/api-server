import {Schema, model} from 'mongoose';

const addOnSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export default model('AddOn', addOnSchema);