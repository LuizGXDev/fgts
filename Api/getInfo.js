import jwt from 'jsonwebtoken';
import conexao from '../conexao.js';

const JWT_SECRET = 'secreta-chave';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ erro: 'Você precisa estar logado para acessar as informações.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const query = "SELECT * FROM dados WHERE usuario_id = ?";
            conexao.all(query, [decoded.id], (erro, results) => {
                if (erro) {
                    return res.status(500).json({ erro: 'Erro no servidor de banco de dados.' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ erro: 'Nenhum dado encontrado.' });
                }

                res.status(200).json({ dados: results });
            });
        } catch (err) {
            return res.status(401).json({ erro: 'Token inválido ou expirado.' });
        }
    } else {
        return res.status(405).json({ erro: 'Método não permitido.' });
    }
}
