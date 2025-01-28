const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "Les champs 'to', 'subject', et 'message' sont requis." });
  }

  try {
    // Configuration du transporteur
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Adresse email Gmail
        pass: process.env.EMAIL_PASS, // Mot de passe d'application Gmail
      },
    });

    // Paramètres de l'email
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email envoyé avec succès !" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
