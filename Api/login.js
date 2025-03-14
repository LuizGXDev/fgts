import express from 'express';
import bcrypt from 'bcryptjs';
import conexao from './conexao.js';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Schema de validação para login
const loginSchema = Joi.object({
    usuario: Joi.string().email().required(),
    senha: Joi.string().min(6).required()
});

const JWT_SECRET = 'secreta-chave';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { usuario, senha } = req.body;
        const { error } = loginSchema.validate({ usuario, senha });

        if (error) {
            return res.status(400).json({ erro: 'Usuário ou senha inválidos.' });
        }

        try {
            const query = "SELECT * FROM usuarios WHERE usuario = ?";
            conexao.all(query, [usuario], async (erro, result) => {
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

                const token = jwt.sign({ id: usuarioEncontrado.id }, JWT_SECRET, { expiresIn: '1h' });

                return res.status(200).json({ mensagem: 'Login bem-sucedido.', token });
            });
        } catch (error) {
            return res.status(500).json({ erro: 'Erro no servidor.' });
        }
    } else {
        return res.status(405).json({ erro: 'Método não permitido.' });
    }
}
