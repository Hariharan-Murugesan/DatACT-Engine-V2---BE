import { Request, Response } from "express";
import { CONSTANT_MSG } from "../common/constant_message";
import adminService from "../services/admin.service";

const addRejectReason = async (req: Request, res: Response) => {
    try {
        const reason: any = await adminService.addRejectReason(req.body);
        return res.status(reason.statusCode).send(reason);
    } catch (error: any) {
        console.log("Error in addRejectReason API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const getRejectReason = async (req: Request, res: Response) => {
    try {
        const reason: any = await adminService.getRejectReason(req.body);
        return res.status(reason.statusCode).send(reason);
    } catch (error: any) {
        console.log("Error in getRejectReason API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const updateRejectReason = async (req: Request, res: Response) => {
    try {
        const reason: any = await adminService.updateRejectReason(req.params.id, req.body);
        return res.status(reason.statusCode).send(reason);
    } catch (error: any) {
        console.log("Error in updateRejectReason API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const deleteRejectReason = async (req: Request, res: Response) => {
    try {
        const reason: any = await adminService.deleteRejectReason(req.params.id);
        return res.status(reason.statusCode).send(reason);
    } catch (error: any) {
        console.log("Error in deleteRejectReason API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const getRejectReasonList = async (req: Request, res: Response) => {
    try {
        const reason: any = await adminService.getRejectReasonList(req.params.id);
        return res.status(reason.statusCode).send(reason);
    } catch (error: any) {
        console.log("Error in getRejectReasonList API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

export default {
    addRejectReason,
    getRejectReason,
    updateRejectReason,
    deleteRejectReason,
    getRejectReasonList,
};