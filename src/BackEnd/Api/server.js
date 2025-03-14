import express from 'express';
import cors from 'cors';
import session from 'express-session';
import sqlite3 from 'sqlite3';  // Importando a biblioteca sqlite3
import rotasPublicas from '../Routes/rotasPublicas';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'https://fgts-hl3z.vercel.app/',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Criar uma instância do banco SQLite em arquivo
const db = new sqlite3.Database('./fgtsnovo.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

// Configuração de sessão usando SQLite
app.use(session({
    secret: 'dakota@fgts',
    resave: false,
    saveUninitialized: false,
    store: {
        get: (sid, callback) => {
            db.get('SELECT * FROM sessions WHERE sid = ?', [sid], (err, row) => {
                callback(err, row ? JSON.parse(row.data) : null);
            });
        },
        set: (sid, session, callback) => {
            const data = JSON.stringify(session);
            db.run('INSERT OR REPLACE INTO sessions (sid, data) VALUES (?, ?)', [sid, data], callback);
        },
        destroy: (sid, callback) => {
            db.run('DELETE FROM sessions WHERE sid = ?', [sid], callback);
        }
    },
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000
    }
}));

// Criar a tabela de sessões no SQLite, caso não exista
db.run('CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, data TEXT)', (err) => {
    if (err) {
        console.error('Erro ao criar a tabela de sessões:', err.message);
    }
});

// Usando as rotas públicas
app.use('/admin', rotasPublicas);

// Exportação para o Vercel (serverless function)
export default function handler(req, res) {
    app(req, res);  // Fazendo a ponte entre Express e a função serverless
}
