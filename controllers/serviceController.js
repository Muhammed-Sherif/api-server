import User from '../models/reservationModel.js';
import Service from '../models/serviceModel.js';

export const getAllServices = async (req, res) => {
    const services = await Service.find();
    res.status(200).json({
        status: 'success',
        result: services.length,
        data: {
            services
        }
    });
}
export const createService = async (req, res) => {
    console.log(req.body);
    const newService = await Service.create({
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        icon: req.body.icon,
        price: req.body.price,
        currency: req.body.currency,
        deliveryTime: req.body.deliveryTime,
        revisions: req.body.revisions,
        features: req.body.features
    });
    res.status(201).json({
        status: 'success',
        data: {
            service: newService
        }
    });
}

export const getService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        return res.status(404).json({
            status: 'fail',
            message: 'Service not found'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            service
        }
    });
}

export const updateService = async (req, res) => {

    const payload = {
        title: req.body.title,
        description: req.body.description,
        icon: req.body.icon,
        price: req.body.price,
        currency: req.body.currency,
        deliveryTime: req.body.deliveryTime,
        revisions: req.body.revisions,
        features: req.body.features
    };

    const service = await Service.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            service
        }
    });
}
export const deleteService = async (req, res) => {
    await Service.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
}