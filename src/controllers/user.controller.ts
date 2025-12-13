import { CONSTANT_MSG } from "../common/constant_message";
import { getJwtToken } from "../middleware/authendication";
import userService from "../services/user.service"
import validation from "../validator/validator";
import { Request, Response } from "express";

const addUser = async (req: Request, res: Response) => {
    try {
        const user: any = await userService.addUser(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error: any) {
        console.log("Error in addUser API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const user: any = await userService.getUser(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error: any) {
        console.log("Error in getUser API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const user: any = await userService.updateUser(req.params.id, req.body);
        return res.status(user.statusCode).send(user);
    } catch (error: any) {
        console.log("Error in updateUser API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const user: any = await userService.deleteUser(req.params.id);
        return res.status(user.statusCode).send(user);
    } catch (error: any) {
        console.log("Error in deleteUser API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const userLogin = async (req: any, res: any) => {
    try {
        await validation.userLoginValidator.validateAsync(req.body);
        const user: any = await userService.userLogin(req.body);
        if (user.status != 'error') {
            const token = await getJwtToken(user.data);
            return res.status(user.statusCode).setHeader('Set-Cookie', `ssid=${token}; Expires=Thu, 20 Dec 2026 07:28:00 GMT; Path=/; Secure`).send(user);
        }
        return res.status(user.statusCode).send(user);
    } catch (error: any) {
        console.log("Error in userLogin API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const userLogout = async (req: any, res: any) => {
    try {
        const user: any = await userService.userLogout(req.body);
        return res.status(user.statusCode).send(user);
    } catch (error: any) {
        console.log("Error in userLogout API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const geUserDetails = async (req: any, res: any) => {
    try {
        const user: any = await userService.userDetails(req);
        return res.status(user.statusCode).send(user);
    } catch (error: any) {
        console.log("Error in geUserDetails API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const uploadCSVData = async (req: Request, res: Response) => {
    try {
        const data: any = await userService.uploadCSVData(req.params.id, req);
        return res.status(data.statusCode).send(data);
    } catch (error: any) {
        console.log("Error in uploadCSVData API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const downloadReport = async (req: Request, res: Response) => {
    try {
        const data: any = await userService.downloadReport(req.params.reportType, req.body);
        return res.status(data.statusCode).send(data);
    } catch (error: any) {
        console.log("Error in downloadReport API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

export default {
    userLogin,
    userLogout,
    geUserDetails,
    addUser,
    getUser,
    updateUser,
    deleteUser,
    uploadCSVData,
    downloadReport
};