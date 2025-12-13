export const CONFIG = {
    serviceName: process.env.SERVICE_NAME || "BK_SERVICE",
    mongodbURI: process.env.MONGO_DB_URL || "mongodb://localhost:27017/panasonic",
    url: process.env.URL || "http://localhost:8600",
    localUrl: process.env.LOCAL_URL || "http://localhost:8600",
    port: process.env.PORT || 9600,
    recordLimit: process.env.RECORD_LIMIT || 10000
}