import db from './server/db.js';

db.all("SELECT id, nome, status, booking_token, created_at FROM bookings ORDER BY id DESC LIMIT 5", [], (err, rows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
});
