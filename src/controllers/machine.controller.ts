import { CONSTANT_MSG } from "../common/constant_message";
import machineService from "../services/machine.service"

const machineList = async (req: any, res: any) => {
    try {
        const machine = await machineService.machineList();
        return res.status(machine.statusCode).send(machine);
    } catch (error: any) {
        console.log("Error in machineList API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const machineListDetails = async (req: any, res: any) => {
    try {
        const machine = await machineService.machineListDetails(req.body);
        return res.status(machine.statusCode).send(machine);
    } catch (error: any) {
        console.log("Error in machineListDetails API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const machineDropList = async (req: any, res: any) => {
    try {
        const machine = await machineService.machineDropList(req.body);
        return res.status(machine.statusCode).send(machine);
    } catch (error: any) {
        console.log("Error in machineDropList API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const reportDownload = async (req: any, res: any) => {
    try {
        const machine = await machineService.reportDownload(req.body);
        return res.status(machine.statusCode).send(machine);
    } catch (error: any) {
        console.log("Error in reportDownload API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const specificationDropList = async (req: any, res: any) => {
    try {
        const machine = await machineService.specificationDropList(req.body);
        return res.status(machine.statusCode).send(machine);
    } catch (error: any) {
        console.log("Error in specificationDropList API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const specificationListDetails = async (req: any, res: any) => {
    try {
        const machine = await machineService.specificationListDetails(req.body);
        return res.status(machine.statusCode).send(machine);
    } catch (error: any) {
        console.log("Error in specificationListDetails API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const allMachineList = async (req: any, res: any) => {
    try {
        const machine = await machineService.allMachineList(req.body);
        return res.status(machine.statusCode).send(machine);
    } catch (error: any) {
        console.log("Error in allMachineList API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const updateMachineDetails = async (req: any, res: any) => {
    try {
        const machine = await machineService.updateMachineDetails(req.body);
        return res.status(machine.statusCode).send(machine);
    } catch (error: any) {
        console.log("Error in updateMachineDetails API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const stationList = async (req: any, res: any) => {
    try {
        const station = await machineService.stationList(req.body);
        return res.status(station.statusCode).send(station);
    } catch (error: any) {
        console.log("Error in updateMachineDetails API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

const stationReportDownload = async (req: any, res: any) => {
    try {
        const station = await machineService.stationReportDownload(req.body);
        return res.status(station.statusCode).send(station);
    } catch (error: any) {
        console.log("Error in updateMachineDetails API: ", error);
        return res.status(CONSTANT_MSG.STATUS_CODE.ERROR).send({ statusCode: CONSTANT_MSG.STATUS_CODE.ERROR, status: CONSTANT_MSG.STATUS.ERROR, message: error.message });
    }
};

export default {
    machineList,
    machineDropList,
    machineListDetails,
    reportDownload,
    specificationDropList,
    specificationListDetails,
    allMachineList,
    updateMachineDetails,
    stationList,
    stationReportDownload
};