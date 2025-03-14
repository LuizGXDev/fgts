import express from 'express';
import cors from 'cors';
import session from 'express-session';
import mysqlSession from 'express-mysql-session';
import rotasPublicas from './rotasPublicas.js';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://85.209.93.252:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'fgtsnovo'
});

app.use(session({
    secret: 'dakota@fgts',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000
    }
}));

app.use('/admin', rotasPublicas);

// Exportação para o Vercel (serverless function)
export default function(req, res) {
    app(req, res); // Fazendo a ponte entre Express e a função serverless
}
