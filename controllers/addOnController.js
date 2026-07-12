import AddOn from "../models/addOnModel.js";

export const getAllAddOns = async (req, res) => {
    const addOns = await AddOn.find();
    res.status(200).json({
        status: 'success',
        result: addOns.length,
        data: {
            addOns
        }
    });
}

export const createAddOn = async (req, res) => {
    console.log(req.body);
    const newAddOn = await AddOn.create({
        label: req.body.label,
        description: req.body.description,
        price: req.body.price
    });
    res.status(201).json({
        status: 'success',
        data: {
            addOn: newAddOn
        }
    });
}

export const updateAddOn = async (req, res) => {

    const payload = {
        label: req.body.label,
        description: req.body.description,
        price: req.body.price
    };

    const addOn = await AddOn.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            addOn
        }
    });
}

export const getAddOn = async (req, res) => {
    const addOn = await AddOn.findById(req.params.id);
    if (!addOn) {
        return res.status(404).json({
            status: 'fail',
            message: 'Add-on not found'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            addOn
        }
    });
}

export const updateAddOn = async (req, res) => {

    const payload = {
        label: req.body.label,
        description: req.body.description,
        price: req.body.price
    };

    const addOn = await AddOn.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            addOn
        }
    });
}
export const deleteAddOn = async (req, res) => {
    await AddOn.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
}