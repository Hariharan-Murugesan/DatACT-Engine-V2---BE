export const CONSTANT_MSG = {
    STATUS_CODE: {
        SUCCESS: 200,
        ERROR: 400,
        UNAUTH: 401,
        INTERNAL_SERVER: 500,
    },
    ROLE: {
        ADMIN: "Admin",
        PRODUCTION: "Production",
        SUPERVISOR: "Supervisor",
        USER: "PDI User"
    },
    ROLES: ["Admin", "Production", "Supervisor", "PDI User"],
    STATUS: {
        SUCCESS: 'success',
        ERROR: 'error'
    },
    USER: {
        LOGIN_SUCCESSFULLY: "User logged in successfully",
        LOGOUT_SUCCESSFULLY: "User logged successfully",
        INCORRECT_USERNAME_OR_PASSWORD: "Incorrect credentials provided. Please check and try again",
        USER_NOT_REGISTED: "User not registered",
        USER_FETCHED: "User details fetched successfully",
    },
    ERROR_MSG: {
        UNAUTHORIZED_NO_PERMISSION_ERROR: 'Login to access this feature'
    },
    CSV_FIELDS: {
        USER: ["name", "username", "password", "role",],
        MODELMASTERS: ['model', 'station1CT', 'station2CT', 'station3CT', 'station4CT', 'station5CT', 'station6CT',
            'station7CT', 'station8CT', 'station9CT', 'station10CT', 'station1path', 'station2path', 'station3path',
            'station4path', 'station5path', 'station6path', 'station7path', 'station8path', 'station9path', 'station10path', 'totalCT'],
        PRODUCTIONORDER: ['date', 'model', 'quantity'],
        REJECTREASON: ['reasonCode', 'reason'],
        MANUALREPORT: ["personName", "date", "from", "to", "category", "workLossCode", "workLossDetail", "section", "difference", "inMinutes"],
        MACHEINE: ["ware", "stockOu", "stati", "orderNo", "shipme", "orderRece", "order", "stockOut", "finish", "partsNo", "name", "st", "inst", "ship", "remain", "shortage", "mismatch", "pr", "sp", "ab", "standard", "shelf", "note", "finalColor"
        ]
    },
    MACHINE:{
        MACHINE_FETCHED: "Machine details fetch successfully",
    },
}