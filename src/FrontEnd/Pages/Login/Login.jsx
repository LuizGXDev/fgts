import React, { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";
import logo from "../../Assets/img/5087317693744393531.jpg";

function Login() {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!usuario || !senha) {
            setTipoMensagem("erro");
            setMensagem("Por favor, preencha os campos de usuário e senha.");
            return;
        }

        // URL completa da API
        const apiUrl = "https://fgts-hl3z.vercel.app/api/login"; // URL completa com HTTP

        try {
            const response = await axios.post(
                apiUrl, 
                { usuario, senha },
                { 
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // Habilita cookies para autenticação
                }
            );

            if (response.status === 200) {
                setTipoMensagem("sucesso");
                setMensagem("Login bem-sucedido! Redirecionando...");
                // Aqui você pode redirecionar ou fazer outra ação ao fazer login
                // window.location.href = '/admin/dashboard';
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setTipoMensagem("erro");
                setMensagem(error.response.data.erro);
            } else {
                setTipoMensagem("erro");
                setMensagem("Erro ao tentar fazer login. Tente novamente mais tarde.");
            }
        }
    };

    return (
        <div className={styles.containerIndex}>
            <div className={styles.formContainer}>
                <div className={styles.imageContainer}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </div>
                <h1 className={styles.title}>Dakota Painel</h1>
                <p className={styles.subtitle}>Entre com sua conta</p>

                {mensagem && (
                    <p className={`${styles.mensagem} ${tipoMensagem === 'erro' ? styles.error : styles.success}`}>
                        {mensagem}
                    </p>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label htmlFor="usuario" className={styles.label}>Usuário</label>
                        <input 
                            type="text" 
                            id="usuario" 
                            name="usuario" 
                            className={styles.input} 
                            placeholder="Digite seu usuário" 
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)} 
                        />
                    </div>
                    <div className={styles.inputContainer}>
                        <label htmlFor="senha" className={styles.label}>Senha</label>
                        <input 
                            type="password" 
                            id="senha" 
                            name="senha" 
                            className={styles.input} 
                            placeholder="Digite sua senha" 
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)} 
                        />
                    </div>
                    <button type="submit" className={styles.btnLogin}>Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
