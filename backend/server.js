import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import multer from "multer"; 
import path from "path"; 

const app = express();
const PORT = 5000;

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "OPTIONS" , "DELETE"],
    allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.use('/schoolImages', express.static(path.join(process.cwd(), 'schoolImages')));

const pool = mysql.createPool({
    host: "localhost",
    user: "root",       
    password: "",       
    database: "schooldb",
    waitForConnections: true,
    connectionLimit: 10,
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'schoolImages/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.get("/health", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 + 1 AS two");
        res.json({ ok: true, db: rows?.[0]?.two === 2 });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

app.post("/add-school", upload.single('image'), async (req, res) => {
    const { name, address, city, state, contact, email_id } = req.body || {};
    // --- Change 3: Updated the image path for the database ---
    const imagePath = req.file ? `/schoolImages/${req.file.filename}` : null; 

    if (!name || !address || !city || !state || !contact || !imagePath || !email_id) {
        return res.status(400).json({ error: "All fields, including image, are required" });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO schools (name, address, city, state, contact, image, email_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, address, city, state, contact, imagePath, email_id]
        );
        res.json({ message: "School Added", id: result.insertId });
    } catch (e) {
        console.error("DB insert error:", e);
        res.status(500).json({ error: e.message });
    }
});

app.get("/get-schools", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM schools");
        res.json(rows);
    } catch (e) {
        console.error("DB fetch error:", e);
        res.status(500).json({ error: e.message });
    }
});

app.delete("/delete-school/:id", async (req, res) => {
    const { id } = req.params; 

    try {
        const [result] = await pool.execute("DELETE FROM schools WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "School not found" });
        }

        res.json({ message: "School deleted successfully" });
    } catch (e) {
        console.error("DB delete error:", e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, async () => {
    try {
        await pool.getConnection(); 
        console.log("✅ MySQL Pool connected successfully!");
    } catch (e) {
        console.error("❌ Failed to connect to MySQL Pool:", e.message);
    }
    console.log(`Server running on http://localhost:${PORT}`);
});











