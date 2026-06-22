import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "cp_tracker",
    password: "24032012",
    port: 5432
});
db.connect();
export default db;