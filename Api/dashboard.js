import jwt from 'jsonwebtoken';
import conexao from '../conexao.js';

const JWT_SECRET = '@dakota';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ erro: 'Você precisa estar logado para acessar a dashboard.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const query = "SELECT * FROM usuarios WHERE id = ?";
            conexao.all(query, [decoded.id], (erro, result) => {
                if (erro) {
                    return res.status(500).json({ erro: 'Erro no servidor de banco de dados.' });
                }

                if (result.length === 0) {
                    return res.status(400).json({ erro: 'Usuário não encontrado.' });
                }

                res.status(200).json({
                    mensagem: 'Bem-vindo à sua dashboard!',
                    usuario: result[0]
                });
            });
        } catch (err) {
            return res.status(401).json({ erro: 'Token inválido ou expirado.' });
        }
    } else {
        return res.status(405).json({ erro: 'Método não permitido.' });
    }
}
