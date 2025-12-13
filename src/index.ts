import express, { Request, Response, NextFunction } from 'express';
import helmet from "helmet";
import cors from 'cors';
import * as http from 'http';
import path from 'path';
import crypto from 'crypto';
import mongoose, { ConnectOptions } from 'mongoose';
import 'dotenv/config';
import router from './routes/route';
import { createAdminOnStartUp } from './services/user.service';

const app = express();
const server = http.createServer(app);
const DB_CONNECTION: any = process.env.MONGO_DB_URL;

app.set('port', process.env.PORT)
app.use(express.json());

const corsOptions = {
    origin: process.env.DOMAIN_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
        'Origin',
        'Authorization',
        'X-Requested-With',
        'Content-Type',
        'Accept',
    ],
    optionsSuccessStatus: 204,
}

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, Authorization, X-Requested-With, Content-Type, Accept',
    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use(router);
app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
    next();
});

app.use(helmet({
    contentSecurityPolicy: {
        reportOnly: true,
    },
}));

app.use(express.static(path.join(__dirname, '../public')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/index.html'))
});


// First API
app.get('', (req, res) => {
    res.send("Hello Developer");
})

server.listen(process.env.PORT, () => {
    mongoose.connect(DB_CONNECTION, { dbName: process.env.DATABASE, useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
        .then(result => {
            console.log('Server running at', process.env.PORT);
            createAdminOnStartUp();
        }).catch(err => {
            console.log(err);
        });
});

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).send('Page/Api Not Found')
    return
})

process.on('SIGINT', function () {
    process.exit(0)
})

process.on('SIGTERM', function () {
    process.exit(0)
})

module.exports = app
