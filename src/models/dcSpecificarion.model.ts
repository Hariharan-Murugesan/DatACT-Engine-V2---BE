import mongoose from 'mongoose';

const dcSpecificationSchema = new mongoose.Schema(
    {
        timestamp: {
            type: String
        },
        "Date time": {
            type: String,
        },
        Asset_Code: {
            type: String
        },
        Engine_Model: {
            type: String,
        },
        Torque1_LSL: {
            type: String
        },
        Torque1_USL: {
            type: String,
        },
        Torque2_LSL: {
            type: String
        },
        Torque2_USL: {
            type: String
        },
        Torque3_LSL: {
            type: String
        },
        Torque3_USL: {
            type: String,
        },
        Torque4_LSL: {
            type: String
        },
        Torque4_USL: {
            type: String
        },
    });

export const DCSpecification = mongoose.model('DCSpecification', dcSpecificationSchema, 'DCSpecification');

