export default function handler(req, res) {
    if (req.method === 'POST') {
        res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
    } else {
        return res.status(405).json({ erro: 'Método não permitido.' });
    }
}
