import bcrypt from 'bcryptjs';
import conexao from '../conexao';  // O caminho pode variar dependendo da sua estrutura
import Joi from 'joi';
import jwt from 'jsonwebtoken';

// Schema de validação para login
const loginSchema = Joi.object({
    usuario: Joi.string().email().required(),
    senha: Joi.string().min(6).required()
});

const JWT_SECRET = 'secreta-chave';

export default async function handler(req, res) {
    // Definindo CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Aceita qualquer origem
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        // Respondendo ao preflight (requisição OPTIONS)
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { usuario, senha } = req.body;

        // Validação com Joi
        const { error } = loginSchema.validate({ usuario, senha });
        if (error) {
            return res.status(400).json({ erro: 'Usuário ou senha inválidos.' });
        }

        try {
            // Consultando o banco de dados para verificar o usuário
            const query = "SELECT * FROM usuarios WHERE usuario = ?";
            conexao.all(query, [usuario], async (erro, result) => {
                if (erro) {
                    return res.status(500).json({ erro: 'Erro no servidor de banco de dados.' });
                }

                if (result.length === 0) {
                    return res.status(400).json({ erro: 'Usuário ou senha incorretos.' });
                }

                const usuarioEncontrado = result[0];

                // Verificando a senha usando bcrypt
                const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);
                if (!senhaCorreta) {
                    return res.status(400).json({ erro: 'Usuário ou senha incorretos.' });
                }

                // Criando o token JWT
                const token = jwt.sign({ id: usuarioEncontrado.id }, JWT_SECRET, { expiresIn: '1h' });

                // Retornando a resposta com o token
                return res.status(200).json({ mensagem: 'Login bem-sucedido.', token });
            });
        } catch (error) {
            return res.status(500).json({ erro: 'Erro no servidor.' });
        }
    } else {
        return res.status(405).json({ erro: 'Método não permitido.' });
    }
}
