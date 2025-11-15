import mysql from 'mysql2';

const configs = [
    { host: process.env.DB_HOST_1, user: process.env.DB_USER_1, password: process.env.DB_PASSWORD_1, database: process.env.DB_NAME_1 },
    { host: process.env.DB_HOST_2, user: process.env.DB_USER_2, password: process.env.DB_PASSWORD_2, database: process.env.DB_NAME_2 },
    { host: process.env.DB_HOST_3, user: process.env.DB_USER_3, password: process.env.DB_PASSWORD_3, database: process.env.DB_NAME_3 },
    { host: process.env.DB_HOST_4, user: process.env.DB_USER_4, password: process.env.DB_PASSWORD_4, database: process.env.DB_NAME_4 },
    { host: process.env.DB_HOST_5, user: process.env.DB_USER_5, password: process.env.DB_PASSWORD_5, database: process.env.DB_NAME_5 }
];

let connection = null;

function tryConnect(configIndex = 0) {
    return new Promise((resolve, reject) => {
        if (configIndex >= configs.length) {
            console.error("❌ Nessuna connessione riuscita.");
            return reject("Nessuna connessione funzionante");
        }

        const conn = mysql.createConnection(configs[configIndex]);

        conn.connect(err => {
            if (err) {
                console.log(`❌ Credenziali #${configIndex + 1} fallite. Provo le successive...`);
                resolve(tryConnect(configIndex + 1));
            } else {
                console.log(`✅ Connesso con configurazione #${configIndex + 1}!`);
                connection = conn;
                resolve(conn);
            }
        });
    });
}

export async function getConnection() {
    if (connection) return connection;
    return await tryConnect();
}
