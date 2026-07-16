import User from '../models/userModel.js';
import Service from '../models/serviceModel.js';
import Reservation from '../models/reservationModel.js';
import {
    ApiError,
    CheckoutPaymentIntent,
    Client,
    Environment,
    LogLevel,
    OrdersController,
} from "@paypal/paypal-server-sdk";

export const getAllReservations = async (req, res) => {
    let filter = {};

    if (req.user.role !== 'admin') {
        filter.user = req.user.id;
    }

    const reservations = await Reservation.find(filter);
    res.status(200).json({
        status: 'success',
        result: reservations.length,
        data: {
            reservations
        }
    });
}
export const createReservationForService = async (req, res) => {
    // validate services exists
    const servicesIds = req.body.services.map((service) => service.id)
    const services = await Services.find({
        _id: { $in: servicesIds }
    })
    if(services.length !== servicesIds.length) {
        res.status(404).json({
            status : 'fail',
            message : 'some services not found'
        })
    }
    // validate addons exists 
    const addOnsIds = req.body.addOns.map((addOn) => addOn.id)
    const addOns = await AddOns.find({
        _id: { $in: addOnsIds }
    })
    if(addOns.length !== addOnsIds.length) {
        res.status(404).json({
            status : 'fail',
            message : 'some addons not found'
        })
    }
    //  create new reservation
    const newReservation = await Reservation.create({
        services: req.body.services,
        user: req.user.id,
        addOns: req.body.addOns,
        reservationDate: req.body?.reservationDate || new Date(),
        details: req.body.details,
    });
    // create payment session
    const { jsonResponse, httpStatusCode } = await createPaymentSession("PAYPAL", newReservation, req.user.id);

    await Reservation.findByIdAndUpdate(newReservation._id, { paypalOrderId: jsonResponse?.id });
    
    res.status(httpStatusCode).json(jsonResponse);
}
const createPaymentSession = async (paymentMethod, reservation, userId) => {

    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

    const client = new Client({
        clientCredentialsAuthCredentials: {
            oAuthClientId: PAYPAL_CLIENT_ID,
            oAuthClientSecret: PAYPAL_CLIENT_SECRET,
        },
        timeout: 0,
        environment: Environment.Sandbox,
        logging: {
            logLevel: LogLevel.Info,
            logRequest: {
                logBody: true,
            },
            logResponse: {
                logHeaders: true,
            },
        },
    });

    const ordersController = new OrdersController(client);

    /**
     * Create an order to start the transaction.
     * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
     */

    let total = reservation.services.reduce((acc, service) => {
        return acc + (service.serviceId.price * service.quantity);
    }, 0);
    total += reservation.addOns.reduce((acc, addOn) => {
        return acc + addOn.price;
    }, 0);
    const collect = {
        body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
                {
                    reservationId: reservation._id.toString(),
                    amount: {
                        currencyCode: "USD",
                        value: total.toFixed(2),
                        breakdown: {
                            itemTotal: {
                                currencyCode: "USD",
                                value: total.toFixed(2),
                            },
                        },
                    },
                    items: reservation.services.map(item => ({
                        name: item.serviceId.title,
                        unitAmount: {
                            currencyCode: "USD",
                            value: item.serviceId.price.toFixed(2),
                        },
                        quantity: item.quantity.toString(),
                        category: "DIGITAL_GOODS",
                    })),
                },
            ]
        },
        prefer: "return=minimal",
    };
    try {
        const { body, ...httpResponse } = await ordersController.createOrder(
            collect
        );
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        return {
            jsonResponse: JSON.parse(body),
            httpStatusCode: httpResponse.statusCode,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            // const { statusCode, headers } = error;
            throw new Error(error.message);
        }
    }
}
/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export const captureOrder = async (req, res) => {
    const collect = {
        id: req.params.id,
        prefer: "return=minimal",
    };

    try {
        const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

        const client = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: PAYPAL_CLIENT_ID,
                oAuthClientSecret: PAYPAL_CLIENT_SECRET,
            },
            timeout: 0,
            environment: Environment.Sandbox,
            logging: {
                logLevel: LogLevel.Info,
                logRequest: {
                    logBody: true,
                },
                logResponse: {
                    logHeaders: true,
                },
            },
        });
        const ordersController = new OrdersController(client);
        const { body, ...httpResponse } = await ordersController.captureOrder(
            collect
        );
        // Get more response info...
        // const { statusCode, headers } = httpResponse;
        res.status(httpResponse.statusCode).json(JSON.parse(body));
    } catch (error) {
        console.error("PayPal Error:");

        if (error.body) {
            console.log(error.body);
        }

        console.dir(error, { depth: null });

        return res.status(500).json(error.body || error);
    }
};
export const getReservation = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            status: 'fail',
            message: 'Reservation ID is required'
        });
    }
    const reservation = await Reservation.findById(req.params.id);

    if (req.user.role !== 'admin' && req.user.id !== reservation.user) {
        return res.status(403).json({
            status: 'fail',
            message: 'You are not allowed to access this reservation'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            reservation
        }
    });
}
export const updateReservation = async (req, res) => {

    const payload = {
        reservationDate: req.body?.reservationDate || undefined,
        status: req.body?.status || undefined
    };
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            reservation
        }
    });
}
export const deleteReservation = async (req, res) => {
    await Reservation.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
}
// createPaymentSession = async (country) => {
//     switch (country) {
//         case 'US':
//             return 'https://checkout.stripe.com/pay/cs_test_us';
//         case 'UK':
//             return 'https://checkout.stripe.com/pay/cs_test_uk';
//         default:
//             return 'https://checkout.stripe.com/pay/cs_test_us';
//     }
//     const service = await Service.find
// ById(serviceId);
//     if (!service) {
//         throw new Error('Service not found');
//     }
// export const checkoutSession = async (req , res) => {
//     const { serviceId, reservationDate } = req.body;
//     createReservationForService(req, res);
//     createPaymentSession(serviceId, reservationDate, req.user.id);
// }