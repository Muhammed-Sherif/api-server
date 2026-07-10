import {Schema, model} from 'mongoose';

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'EGP'],
        default: 'USD'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        required: true
    },
    revisions: {
        type: String,
        required: true
    },
    popular: {
        type: Boolean,
        default: false
    },
    features: [
        {
            type : String , 
            required : true
        }
    ],
    deliveryTime: {
        type: String,
        required: [true, 'Service must have a delivery time field']
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString(),
        select: false
    }
});

export default model('Service', serviceSchema);