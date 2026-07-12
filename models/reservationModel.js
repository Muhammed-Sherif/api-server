import { Schema, model } from 'mongoose';

const reservationSchema = new Schema({
    services: [
        {
            serviceId: {
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
    customerInfo: {
        name: String,
        phone: String,
        email: String,
        projectDescription: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
    ,
    addOns: [
        {
            label: {
                type: String,
                required: true
            } ,
            description: {
                type: String,
                required: true
            } ,
            price: {
                type: Number,
                required: true
            }
        }
    ],
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
    { path: 'services.serviceId' },
    { path: 'user' },
  ]);
  next();
});
reservationSchema.pre(/^find/, function () {
   this.populate('user')
      .populate('services.serviceId');
});
export default model('Reservation', reservationSchema);