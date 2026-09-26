const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./study_tracker.db'); // Aquí se guarda todo tu progreso

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'secreto_super_seguro_2026',
    resave: false,
    saveUninitialized: false
}));

// --- CONFIGURACIÓN DE BASE DE DATOS ---
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS subjects (id INTEGER PRIMARY KEY, user_id INTEGER, name TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, subject_id INTEGER, status TEXT, due_date TEXT, priority TEXT)`);
});

// --- RUTAS DE AUTENTICACIÓN (CREAR CUENTA Y LOGIN) ---
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hash], function(err) {
        if (err) return res.status(400).json({ error: "El usuario ya existe" });
        // Crear materias por defecto
        const defaultSubjects = ['Matemática', 'Historia', 'Lengua'];
        defaultSubjects.forEach(sub => {
            db.run(`INSERT INTO subjects (user_id, name) VALUES (?, ?)`, [this.lastID, sub]);
        });
        res.json({ success: true, message: "Cuenta creada. Por favor, inicia sesión." });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }
        req.session.userId = user.id;
        res.json({ success: true });
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// --- MIDDLEWARE DE SEGURIDAD ---
const checkAuth = (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ error: "No autorizado" });
    next();
};

// --- RUTAS DE MATERIAS (AGREGAR/ELIMINAR TUS PROPIAS CLASES) ---
app.get('/api/subjects', checkAuth, (req, res) => {
    db.all(`SELECT * FROM subjects WHERE user_id = ?`, [req.session.userId], (err, rows) => {
        res.json(rows);
    });
});

app.post('/api/subjects', checkAuth, (req, res) => {
    db.run(`INSERT INTO subjects (user_id, name) VALUES (?, ?)`, [req.session.userId, req.body.name], function(err) {
        res.json({ id: this.lastID, name: req.body.name });
    });
});

// --- RUTAS DE TAREAS ---
app.get('/api/tasks', checkAuth, (req, res) => {
    db.all(`SELECT tasks.*, subjects.name as subject_name FROM tasks LEFT JOIN subjects ON tasks.subject_id = subjects.id WHERE tasks.user_id = ?`, [req.session.userId], (err, rows) => {
        res.json(rows);
    });
});

app.post('/api/tasks', checkAuth, (req, res) => {
    const { title, subject_id, status, due_date, priority } = req.body;
    db.run(`INSERT INTO tasks (user_id, title, subject_id, status, due_date, priority) VALUES (?, ?, ?, ?, ?, ?)`, 
    [req.session.userId, title, subject_id, status, due_date, priority], function(err) {
        res.json({ success: true });
    });
});

// --- RUTA GOOGLE CALENDAR (Lógica de preparación) ---
app.get('/api/sync-calendar', checkAuth, (req, res) => {
    // Aquí iría el código con 'googleapis' y OAuth2. 
    // Por ahora simulamos que trae eventos y los convierte en tareas.
    res.json({ success: true, message: "Conectado a Google Calendar (Simulado). Requiere credenciales OAuth en producción." });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
