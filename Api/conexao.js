import sqlite3 from 'sqlite3';

// Criando o banco de dados SQLite
const db = new sqlite3.Database('./fgtsnovo.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

export default db;
