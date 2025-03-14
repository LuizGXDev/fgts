import mysql from 'mysql2';
// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
        host: 'mysql.hostinger.com',  // O host do banco de dados fornecido pela Hostinger
        user: 'u383660128_dakota',    // O nome do usuário do banco de dados
        password: '@General990',        // A senha do banco de dados
        database: 'u383660128_fgts',  // O nome do banco de dados
        port: 3306                    // Porta padrão do MySQL
  });
  
  // Verificando a conexão
  db.connect((err) => {
    if (err) {
      console.error('Erro na conexão com o banco de dados: ', err);
      return;
    }
    console.log('Conectado ao banco de dados MySQL');
  });
  
 export default db;