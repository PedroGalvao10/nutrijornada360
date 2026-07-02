const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./server/database.sqlite');
db.get('SELECT contrato_html FROM bookings LIMIT 1', (err, row) => {
    if (err) console.error("ERRO:", err);
    if (row) {
        console.log("HTML Length:", row.contrato_html ? row.contrato_html.length : "NULO");
        console.log("HTML Preview:", row.contrato_html ? row.contrato_html.substring(0, 500) : "NULO");
    } else {
        console.log("Nenhuma linha encontrada");
    }
    db.close();
});
