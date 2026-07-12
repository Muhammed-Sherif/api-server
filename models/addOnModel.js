import {Schema, model} from 'mongoose';

const addOnSchema = new Schema({
    label: {
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

export const AddOn = model('AddOn', addOnSchema);