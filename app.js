import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"index.html"));
});
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname,"Pages","dashboard.html"));
});
app.get("/goals", (req, res) => {
    res.sendFile(path.join(__dirname,"Pages","goals.html"));
});
app.get("/contests", (req, res) => {
    res.sendFile(path.join(__dirname,"Pages","contests.html"));
});
app.get("/resources", (req, res) => {
    res.sendFile(path.join(__dirname,"Pages","resources.html"));
});
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,"Pages","about.html"));
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "Pages", "signup.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "Pages", "login.html"));
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});