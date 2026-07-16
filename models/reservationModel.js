import { Schema, model } from 'mongoose';

const reservationSchema = new Schema({
    services: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Service',
                required: [true, 'Service is required'],
            }
            , quantity: {
                type: Number,
                required: [true, 'Quantity is required'],
                default: 1
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    details: {
        projectDescription: {
            type: String,
            required: true
        },
        budget: {
            type: String,
            required: true
        },
        deadline: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
    ,
    addOns: [
        {
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
            }
        }
    ],
    paypalOrderId: {
        type: String,
        unique: true,
        sparse: true
    },
    reservationDate: {
        type: Date,
        required: [true, 'Reservation date is required'],
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
reservationSchema.post('save', async function (doc, next) {
    await doc.populate([
        { path: 'services.id' },
        { path: 'user' },
    ]);
    next();
});
reservationSchema.pre(/^find/, function () {
    this.populate('user')
        .populate('services.id');
});
export default model('Reservation', reservationSchema);