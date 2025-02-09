const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const port = 3001;
const bcrypt = require('bcryptjs');


app.use(cors());
app.use(express.json()); // Pour parser les requêtes JSON

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1',
  database: 'escape_game_db',
});

db.connect((err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// Route pour vérifier les identifiants
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?;', [username], async (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    } else {
      if (result.length > 0) {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password); // Vérifier le mot de passe haché

        if (isMatch) {
          res.json({ success: true, message: 'Connexion réussie' });
        } else {
          res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
        }
      } else {
        res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
      }
    }
  });
});

// Route pour l'inscription
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Vérifier si l'utilisateur existe déjà
  db.query('SELECT * FROM users WHERE username = ? OR email = ?;', [username, email], async (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    } else {
      if (result.length > 0) {
        res.status(400).json({ success: false, message: 'Nom d\'utilisateur ou email déjà utilisé' });
      } else {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer le nouvel utilisateur dans la base de données
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?);', [username, email, hashedPassword], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Erreur serveur' });
          } else {
            res.json({ success: true, message: 'Utilisateur créé avec succès' });
          }
        });
      }
    }
  });
});

// Route pour enregistrer le score
app.post('/api/saveScore', (req, res) => {
  const { username, score, scenario } = req.body;

  db.query('INSERT INTO scores (username, score, scenario) VALUES (?, ?, ?);', [username, score, scenario], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    } else {
      res.json({ success: true, message: 'Score enregistré avec succès' });
    }
  });
});

// Route pour obtenir le classement
app.get('/api/leaderboard', (req, res) => {
  const { scenario } = req.query;

  db.query('SELECT username, score FROM scores WHERE scenario = ? ORDER BY score DESC LIMIT 10;', [scenario], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    } else {
      res.json({ success: true, leaderboard: result });
    }
  });
});

// Route pour obtenir les statistiques
app.get('/api/stats', (req, res) => {
  const { username } = req.query;

  db.query('SELECT COUNT(*) as gamesPlayed, AVG(score) as avgScore FROM scores WHERE username = ?;', [username], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    } else {
      res.json({ success: true, stats: result[0] });
    }
  });
});

// Route pour sauvegarder la progression
app.post('/api/saveProgress', (req, res) => {
  const { username, scenario, progress } = req.body;

  db.query('INSERT INTO progress (username, scenario, progress) VALUES (?, ?, ?);', [username, scenario, progress], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    } else {
      res.json({ success: true, message: 'Progression sauvegardée avec succès' });
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});