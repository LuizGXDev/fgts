import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
import foto from '../../Assets/img/5087317693744393531.jpg';  // Certifique-se de ter o arquivo de imagem
import { FaSignOutAlt } from 'react-icons/fa';  // Ícone de logout
import { useNavigate } from 'react-router-dom';  // Hook de navegação

const Dashboard = () => {
    const [autenticado, setAutenticado] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [usuario, setUsuario] = useState('');
    const [dados, setDados] = useState([]);  // Garantir que os dados comecem como um array
    const [carregando, setCarregando] = useState(true);  // Estado de carregamento
    const navigate = useNavigate();  // Navegação para redirecionar

    useEffect(() => {
        const verificarAutenticacao = async () => {
            try {
                // Usando URL completa para verificar a autenticação
                const response = await axios.get("https://fgts-hl3z.vercel.app/api/dashboard", { withCredentials: true });

                if (response.status === 200) {
                    setAutenticado(true);
                    setMensagem(response.data.mensagem);
                    setUsuario(response.data.usuario);

                    // Usando URL completa para obter dados bancários
                    const dadosBancariosResponse = await axios.get("https://fgts-hl3z.vercel.app/api/getinfos", { withCredentials: true });
                    if (dadosBancariosResponse.status === 200) {
                        setDados(dadosBancariosResponse.data.dados);  // Definindo os dados recebidos
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setAutenticado(false);
                    setMensagem('Você precisa estar logado para acessar a dashboard.');
                } else {
                    setMensagem('Erro ao verificar autenticação.');
                }
            } finally {
                setCarregando(false); // Finaliza o carregamento
            }
        };

        verificarAutenticacao();
    }, []);  

    // Função de logout
    const handleLogout = async () => {
        try {
            // Usando URL completa para logout
            await axios.post(
                "http://85.209.93.252:3000/admin/logout",  // URL completa para logout
                {},
                { withCredentials: true }
            );
            setAutenticado(false);  // Atualiza o estado de autenticação
            navigate('/admin/login');  // Redireciona para a página de login após logout
        } catch (error) {
            console.log("Erro ao tentar deslogar:", error);
        }
    };

    if (carregando) {
        return (
            <div className={styles.container}>
                <p>Carregando...</p>
            </div>
        );
    }

    if (!autenticado) {
        return (
            <div className={styles.container}>
                <div className={styles.mensagemContainer}>
                    <p>{mensagem}</p>
                    <button onClick={() => navigate('/admin/login')}>Ir para o Login</button>  {/* Usando navegação do react-router */}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src={foto} alt="Foto do usuário" className={styles.fotoUsuario} />
                <h1>Olá, {usuario}</h1>
                {/* Botão de Logout */}
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <FaSignOutAlt /> Sair
                </button>
            </header>

            <main className={styles.main}>
                <h2>Informações Bancárias</h2>
                {dados.length > 0 ? (
                    <table className={styles.tabela}>
                        <thead>
                            <tr>
                                <th>CPF</th>
                                <th>Agência</th>
                                <th>Conta</th>
                                <th>Código de Saque</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dados.map((item, index) => (
                                <tr key={index}>
                                    <td className={styles.cpf}>{item.cpf}</td>
                                    <td>{item.agencia}</td>
                                    <td>{item.conta}</td>
                                    <td>{item.codigo_saque}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Sem dados bancários disponíveis.</p>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
