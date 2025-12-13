import express from 'express';
import userController from '../controllers/user.controller';
import { checkJwtToken } from '../middleware/authendication';
import adminController from '../controllers/admin.controller';
import multer from 'multer'
import machineController from '../controllers/machine.controller';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
})

// User
router.post('/auth/login', userController.userLogin);
router.post('/auth/logout', userController.userLogout);
router.get('/auth/user', checkJwtToken, userController.geUserDetails);

// Admin
router.post('/api/addUser', checkJwtToken, userController.addUser);
router.post('/api/getUsers', checkJwtToken, userController.getUser);
router.put('/api/updateUser/:id', checkJwtToken, userController.updateUser);
router.delete('/api/deleteUser/:id', checkJwtToken, userController.deleteUser);

router.post('/api/addRejectReason', checkJwtToken, adminController.addRejectReason);
router.post('/api/getRejectReasons', checkJwtToken, adminController.getRejectReason);
router.put('/api/updateRejectReason/:id', checkJwtToken, adminController.updateRejectReason);
router.delete('/api/deleteRejectReason/:id', checkJwtToken, adminController.deleteRejectReason);
router.get('/api/getRejectReasonList', checkJwtToken, adminController.getRejectReasonList);

// Machine
router.post('/api/machineList', machineController.machineList);
router.post('/api/machineDropList', machineController.machineDropList);
router.post('/api/machineListDetails', machineController.machineListDetails);
router.post('/api/reportDownload', machineController.reportDownload);

router.post('/api/specificationDropList', machineController.specificationDropList);
router.post('/api/specificationListDetails', machineController.specificationListDetails);

router.post('/api/allMachineList', machineController.allMachineList);
router.post('/api/updateMachineDetails', machineController.updateMachineDetails);


router.post('/api/stationList', machineController.stationList);
router.post('/api/stationReportDownload', machineController.stationReportDownload);

// Common
router.post('/api/uploadCSVData/:id', upload.any(), checkJwtToken, userController.uploadCSVData);
router.post('/api/downloadReport/:reportType', checkJwtToken, userController.downloadReport);

export default router;