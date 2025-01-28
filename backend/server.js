const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');
const bcrypt = require('bcryptjs');

const fs = require('fs');
const app = express();
const multer = require('multer');
const path = require('path');
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers du dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Vérifiez si le dossier "uploads" existe, sinon créez-le
    if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
    }

// Définir la fonction de filtrage des fichiers
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true); // Accepter les images et PDF
    } else {
        cb(new Error('Seuls les fichiers image et PDF sont autorisés'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix); // Nomme le fichier de manière unique
    }
});

// Configuration complète Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de taille : 5 Mo
});

app.use('/uploads', express.static('uploads'));
/*
app.post('/api/projets', upload.fields([{ name: 'image' }, { name: 'document' }]), async (req, res) => {
    console.log('Body:', req.body); // Logs des données envoyées
    console.log('Files:', req.files); // Logs des fichiers envoyés

    try {
        const { projectName, projectDescription, startDate, endDate, clientId } = req.body;
        const image = req.files['image'] ? req.files['image'][0] : null;
        const document = req.files['document'] ? req.files['document'][0] : null;

        // Validation des champs
        if (!projectName || !projectDescription || !startDate || !endDate || !clientId) {
            return res.status(400).json({ message: "Tous les champs sont requis, y compris l'ID du client." });
        }

        // Récupérer le chemin relatif du fichier image et document
        const imagePath = image ? `http://localhost:5000/uploads/${image.filename}` : null; // URL de l'image
        const documentPath = document ? `http://localhost:5000/uploads/${document.filename}` : null; // URL du document

        // Préparation des données pour l'insertion
        const newProject = {
            projectName,
            projectDescription,
            startDate,
            endDate,
            clientId,
            imagePath: image ? image.path : null, // Chemin de l'image
            documentPath: document ? document.path : null // Chemin du documen
        };

        // Insertion dans la base de données
        const result = await pool.query(
            'INSERT INTO projets (nom, description, date_debut, date_fin, id_client, image_path, document_path,statut) VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *',
            [
                newProject.projectName,
                newProject.projectDescription,
                newProject.startDate,
                newProject.endDate,
                newProject.clientId,
                newProject.imagePath,
                newProject.documentPath,
                'pending'
            ]
        );

        //Utilisateur
        const createdProject = result.rows[0];

        // Insertion dans la table notifications
        const notificationMessage = `Un nouveau projet nommé "${projectName}" a été commandé par le client ID ${clientId}.`;
        await pool.query(
            'INSERT INTO notifications (message, type, id_utilisateur, id_projet, lu, date_envoi) VALUES ($1, $2, $3, $4, $5, NOW())',
            [
                notificationMessage,          // Message
                'Nouveau Projet',             // Type de notification
                clientId,                     // ID utilisateur (client)
                createdProject.id_projet,     // ID du projet créé
                false                         // est_lu (non lu par défaut)
            ]
        );

        // Retourner le projet créé
        res.status(201).json({ 
            project: createdProject,
            notification: { message: notificationMessage }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});*/
app.post('/api/projets', upload.fields([{ name: 'image' }, { name: 'document' }]), async (req, res) => {
  console.log('Body:', req.body); // Logs des données envoyées
  console.log('Files:', req.files); // Logs des fichiers envoyés

  try {
      const { projectName, projectDescription, startDate, endDate, clientId } = req.body;
      const image = req.files['image'] ? req.files['image'][0] : null;
      const document = req.files['document'] ? req.files['document'][0] : null;

      // Validation des champs
      if (!projectName || !projectDescription || !startDate || !endDate || !clientId) {
          return res.status(400).json({ message: "Tous les champs sont requis, y compris l'ID du client." });
      }

      // Récupérer le chemin relatif du fichier image et document
      const imagePath = image ? `http://localhost:5000/uploads/${image.filename}` : null; // URL de l'image
      const documentPath = document ? `http://localhost:5000/uploads/${document.filename}` : null; // URL du document

      // Préparation des données pour l'insertion
      const newProject = {
          projectName,
          projectDescription,
          startDate,
          endDate,
          clientId,
          imagePath: image ? image.path : null, // Chemin de l'image
          documentPath: document ? document.path : null // Chemin du document
      };

      // Insertion dans la base de données
      const result = await pool.query(
          'INSERT INTO projets (nom, description, date_debut, date_fin, id_client, image_path, document_path, statut) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
          [
              newProject.projectName,
              newProject.projectDescription,
              newProject.startDate,
              newProject.endDate,
              newProject.clientId,
              newProject.imagePath,
              newProject.documentPath,
              'pending'
          ]
      );

      // Utilisateur
      const createdProject = result.rows[0];

      // Notification pour le client (qui a commandé le projet)
      const clientNotificationMessage = `Votre projet "${projectName}" a été commandé avec succès. Il est actuellement en attente de traitement.`;
      await pool.query(
          'INSERT INTO notifications (message, type, id_utilisateur, id_projet, destinataire, lu, priorite, date_envoi) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
          [
              clientNotificationMessage,          // Message
              'Commande',                         // Type de notification
              clientId,                           // ID utilisateur (client)
              createdProject.id_projet,           // ID du projet créé
              'Client',                           // Destinataire
              false,                              // Non lu
              1,                                  // Priorité
          ]
      );

      // Notification pour l'admin (le projet a été commandé)
      const adminNotificationMessage = `Un nouveau projet nommé "${projectName}" a été commandé par le client ID ${clientId}.`;
      await pool.query(
          'INSERT INTO notifications (message, type, id_utilisateur, id_projet, destinataire, lu, priorité, date_envoi) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
          [
              adminNotificationMessage,           // Message
              'Commande',                         // Type de notification
              1,                                  // ID de l'admin
              createdProject.id_projet,           // ID du projet créé
              'Admin',                            // Destinataire
              false,                              // Non lu
              1,                                  // Priorité
          ]
      );

      
      // Retourner le projet créé et les notifications
      res.status(201).json({ 
          project: createdProject,
          notifications: [
              { message: clientNotificationMessage },
              { message: adminNotificationMessage },
              { message: createdProject.id_chef_de_projet ? chefNotificationMessage : null }
          ]
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
  }
});




app.get('/api/membre', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM utilisateurs WHERE role = 'membre'");
    res.status(200).json(result.rows); // Retourner les utilisateurs
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({ error: 'Erreur du serveur' });
  }
});
app.get('/api/projets/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const projectQuery = `
        SELECT 
          id_projet, 
          nom, 
          description, 
          date_debut, 
          date_fin, 
          statut, 
          id_client, 
          image_path, 
          document_path 
        FROM projets 
        WHERE id_projet = $1;
      `;
      const result = await pool.query(projectQuery, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
  
      const project = result.rows[0];
  
      // Corriger les chemins pour qu'ils soient utilisables dans un navigateur
      if (project.image_path) {
        project.image_path = project.image_path.replace(/\\/g, '/');
      }
      if (project.document_path) {
        project.document_path = project.document_path.replace(/\\/g, '/');
      }
  
      res.status(200).json(project);
    } catch (err) {
      console.error('Erreur lors de la récupération du projet :', err);
      res.status(500).send('Erreur serveur');
    }
  });
/*
  app.put('/api/projets/:id', async (req, res) => {
    const { id } = req.params;
    const { statut, raison_refus, id_chef_projet } = req.body;  // Récupérer les informations nécessaires

    // Vérification du statut
    if (!['pending', 'accepted', 'rejected', 'in progress', 'completed'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    try {
      let updateQuery = 'UPDATE projets SET statut = $1 WHERE id_projet = $2 RETURNING *';
      let queryParams = [statut, id];

      // Si le statut est "refusé", mettre à jour également la raison du refus
      if (statut === 'rejected' && !raison_refus) {
        return res.status(400).json({ message: 'La raison du refus est obligatoire' });
      }

      // Si le statut est "refusé", mettre à jour le statut et la raison
      if (statut === 'rejected') {
        updateQuery = 'UPDATE projets SET statut = $1, raison_refus = $2 WHERE id_projet = $3 RETURNING *';
        queryParams = [statut, raison_refus, id];
      }

      // Si le statut est "accepté", mettre à jour également l'ID du chef de projet
      if (statut === 'accepted') {
        if (!id_chef_projet) {
          return res.status(400).json({ message: 'Un chef de projet doit être sélectionné' });
        }
        
        // Mettre à jour uniquement le statut et l'ID du chef de projet
        updateQuery = 'UPDATE projets SET statut = $1, id_chef_projet = $2 WHERE id_projet = $3 RETURNING *';
        queryParams = [statut, id_chef_projet, id];
      }

      const result = await pool.query(updateQuery, queryParams);
      const updatedProject = result.rows[0];

      if (!updatedProject) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }

      res.status(200).json({ project: updatedProject });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
});
*/
/*app.put('/api/projets/:id', async (req, res) => {
  const { id } = req.params;
  const { statut, raison_refus, id_chef_projet } = req.body;  // Récupérer les informations nécessaires

  // Vérification du statut
  if (!['pending', 'accepted', 'rejected', 'in progress', 'in review','completed',].includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    let updateQuery = 'UPDATE projets SET statut = $1 WHERE id_projet = $2 RETURNING *';
    let queryParams = [statut, id];

    // Si le statut est "refusé", mettre à jour également la raison du refus
    if (statut === 'rejected' && !raison_refus) {
      return res.status(400).json({ message: 'La raison du refus est obligatoire' });
    }

    // Si le statut est "refusé", mettre à jour le statut et la raison
    if (statut === 'rejected') {
      updateQuery = 'UPDATE projets SET statut = $1, raison_refus = $2 WHERE id_projet = $3 RETURNING *';
      queryParams = [statut, raison_refus, id];
    }

    // Si le statut est "accepté", mettre à jour également l'ID du chef de projet
    if (statut === 'accepted') {
      if (!id_chef_projet) {
        return res.status(400).json({ message: 'Un chef de projet doit être sélectionné' });
      }
      
      // Mettre à jour uniquement le statut et l'ID du chef de projet
      updateQuery = 'UPDATE projets SET statut = $1, id_chef_projet = $2 WHERE id_projet = $3 RETURNING *';
      queryParams = [statut, id_chef_projet, id];
    }
    if (statut === 'completed') {
      updateQuery = 'UPDATE projets SET statut = $1 WHERE id_projet = $2 RETURNING *';
      queryParams = [statut, id];
    }


    const result = await pool.query(updateQuery, queryParams);
    const updatedProject = result.rows[0];

    if (!updatedProject) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Création des notifications selon le statut
    const notifications = [];

    // 1. Notification au client
    const clientNotificationMessage = statut === 'accepted' 
      ? `Votre projet "${updatedProject.nom}" a été accepté et un chef de projet a été assigné.` 
      : statut === 'rejected' 
      ? `Votre projet "${updatedProject.nom}" a été refusé. Raison: ${raison_refus}.` 
      : statut === 'completed'
      ? `Votre projet "${updatedProject.nom}" a été complété avec succès.` 
      : '';

    if (clientNotificationMessage) {
      notifications.push({
        message: clientNotificationMessage,
        type: statut === 'accepted' ? 'Accepte' : 'Refuse',
        id_utilisateur: updatedProject.id_client, 
        id_projet: updatedProject.id_projet, 
        destinataire: 'Client',
        lu: false,
        priorité: 1
      });
    }


    // 3. Notification au chef de projet (si projet accepté)
    if (statut === 'accepted' && id_chef_projet) {
      const chefNotificationMessage = `Vous avez été assigné au projet "${updatedProject.nom}".`;
      notifications.push({
        message: chefNotificationMessage,
        type: 'Attribution',
        id_utilisateur: id_chef_projet,
        id_projet: updatedProject.id_projet,
        destinataire: 'Chef de Projet',
        lu: false,
        priorité: 1
      });
    }
    if (statut === 'completed') {
      const chefCompletionMessage = `Le projet "${updatedProject.nom}" a été complété.`;
      notifications.push({
        message: chefCompletionMessage,
        type: 'Complété',
        id_utilisateur: updatedProject.id_chef_projet,
        id_projet: updatedProject.id_projet,
        destinataire: 'Chef de Projet',
        lu: false,
        priorité: 1
      });
    
      // Ajout de la notification pour le client
      const clientCompletionMessage = `Votre projet "${updatedProject.nom}" a été complété avec succès.`;
      notifications.push({
        message: clientCompletionMessage,
        type: 'Complété',
        id_utilisateur: updatedProject.id_client,
        id_projet: updatedProject.id_projet,
        destinataire: 'Client',
        lu: false,
        priorité: 1
      });
    }
    
    // Insérer toutes les notifications dans la base de données
    for (let notification of notifications) {
      await pool.query(
        'INSERT INTO notifications (message, type, id_utilisateur, id_projet, destinataire, lu, priorité, date_envoi) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
        [
          notification.message,
          notification.type,
          notification.id_utilisateur,
          notification.id_projet,
          notification.destinataire,
          notification.lu,
          notification.priorité
        ]
      );
    }

    res.status(200).json({ project: updatedProject, notifications });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});*/
const nodemailer = require('nodemailer');
app.put('/api/projets/:id', async (req, res) => {
  const { id } = req.params;
  const { statut, raison_refus, id_chef_projet } = req.body;

  if (!['pending', 'accepted', 'rejected', 'in progress', 'in review', 'completed'].includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    let updateQuery = 'UPDATE projets SET statut = $1 WHERE id_projet = $2 RETURNING *';
    let queryParams = [statut, id];

    if (statut === 'rejected' && !raison_refus) {
      return res.status(400).json({ message: 'La raison du refus est obligatoire' });
    }

    if (statut === 'rejected') {
      updateQuery = 'UPDATE projets SET statut = $1, raison_refus = $2 WHERE id_projet = $3 RETURNING *';
      queryParams = [statut, raison_refus, id];
    }

    if (statut === 'accepted') {
      if (!id_chef_projet) {
        return res.status(400).json({ message: 'Un chef de projet doit être sélectionné' });
      }
      updateQuery = 'UPDATE projets SET statut = $1, id_chef_projet = $2 WHERE id_projet = $3 RETURNING *';
      queryParams = [statut, id_chef_projet, id];
    }

    if (statut === 'completed') {
      updateQuery = 'UPDATE projets SET statut = $1 WHERE id_projet = $2 RETURNING *';
      queryParams = [statut, id];
    }

    const result = await pool.query(updateQuery, queryParams);
    const updatedProject = result.rows[0];

    if (!updatedProject) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    const notifications = [];
    const destinataires = [];

    if (statut === 'accepted' || statut === 'rejected' || statut === 'completed') {
      // Requête pour récupérer les emails des utilisateurs concernés
      const userEmailsQuery = `
        SELECT email 
        FROM utilisateurs 
        WHERE id_utilisateur IN ($1, $2)`;
      const userIds = [updatedProject.id_client, id_chef_projet];
      const emailResult = await pool.query(userEmailsQuery, userIds);

      const emails = emailResult.rows.map(row => row.email);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // Adresse email Gmail
        pass: process.env.EMAIL_PASS, // Mot de passe d'application Gmail
        }
      });

      const emailPromises = emails.map((email, index) => {
        let message;
        if (index === 0) { // Client
          message = statut === 'accepted'
            ? `Votre projet "${updatedProject.nom}" a été accepté et un chef de projet a été assigné.`
            : statut === 'rejected'
            ? `Votre projet "${updatedProject.nom}" a été refusé. Raison : ${raison_refus}.`
            : statut === 'completed'
            ? `Votre projet "${updatedProject.nom}" a été complété avec succès.`
            : '';
        } else { // Chef de projet
          if (statut === 'accepted') {
            message = `Vous avez été assigné au projet "${updatedProject.nom}".`;
          } else if (statut === 'completed') {
            message = `Le projet "${updatedProject.nom}" a été complété.`;
          }
        }

        // Préparer et envoyer l'email
        if (message) {
          return transporter.sendMail({
            from: 'rajaonariherymandadaniel@gmail.com',
            to: email,
            subject: `Notification: Projet "${updatedProject.nom}"`,
            text: message
          });
        }
      });

      await Promise.all(emailPromises);
    }

    res.status(200).json({ project: updatedProject, notifications });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/api/projets', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projets ORDER BY date_debut DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});


//Notification:
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
    const { userId } = req.params;

    // Vérifier si l'ID de l'utilisateur est fourni
    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur manquant' });
    }

    // Récupérer les notifications pour cet utilisateur, triées par date d'envoi (plus récentes en premier)
    const result = await pool.query(
      'SELECT * FROM notifications WHERE id_utilisateur = $1 ORDER BY date_envoi DESC',
      [userId]
    );

    // Retourner les notifications sous forme de tableau
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});


//notification lue
app.put('/api/notifications/:id', async (req, res) => {
  try {
      const { id } = req.params;

      // Récupérer la date actuelle pour la mise à jour de `date_lecture`
      const currentDate = new Date().toISOString();

      // Mettre à jour la notification pour qu'elle soit marquée comme lue et enregistrer la date de lecture
      const result = await pool.query(
          'UPDATE notifications SET lu = true, date_lecture = $1 WHERE id_notification = $2 RETURNING *',
          [currentDate, id]
      );
      
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Notification non trouvée' });
      }
      
      res.json(result.rows[0]);  // Retourner la notification mise à jour
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
  }
});



app.get('/api/notifications/unread', async (req, res) => {
  try {
    // Récupérer l'ID utilisateur depuis les paramètres de la requête
    const userId = req.query.userId;

    // Vérifier si l'ID utilisateur est fourni
    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur manquant' });
    }

    // Récupérer les notifications non lues pour cet utilisateur
    const result = await pool.query(
      'SELECT * FROM notifications WHERE id_utilisateur = $1 AND lu = false ORDER BY date_envoi DESC',
      [userId]
    );

    // Retourner les notifications non lues
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});







// Récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM utilisateurs');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// Ajouter un utilisateur

app.post('/users', async (req, res) => {
    const { nom, email, role, mot_de_passe } = req.body;

    // Validation des champs
    if (!nom) {
        return res.status(400).json({ error: "Le champ nom est requis" });
    } else if (!email) {
        return res.status(400).json({ error: "Le champ email est requis" });
    } else if (!mot_de_passe) {
        return res.status(400).json({ error: "Le champ mot de passe est requis" });
    } else if (!role) {
        return res.status(400).json({ error: "Le champ rôle est requis" });
    }

    try {
        // Hacher le mot de passe avec bcrypt
        const saltRounds = 10; // Nombre de "rounds" pour générer le sel
        const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);

        // Insérer l'utilisateur dans la base de données avec le mot de passe haché
        const result = await pool.query(
            'INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [nom, email, hashedPassword, role]
        );

        // Retourner l'utilisateur créé (sans inclure le mot de passe haché)
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM utilisateurs WHERE id_utilisateur = $1', [id]);
      if (result.rows.length > 0) {
        const { nom, email, role } = result.rows[0];  // Ajoute le role aussi si nécessaire
        res.json({ name: nom, email, role });
      } else {
        res.status(404).send('Utilisateur non trouvé');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  });
  

// Modifier un utilisateur
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, email, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE utilisateurs SET nom = $1, email = $2, role = $3 WHERE id_utilisateur = $4 RETURNING *',
            [nom, email, role, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

// Supprimer un utilisateur
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM utilisateurs WHERE id_utilisateur = $1', [id]);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});



// Endpoint pour la connexion

app.post('/api/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ error: "Email et mot de passe sont requis" });
    }

    try {
        // Recherche l'utilisateur dans la base de données par email
        const result = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Identifiants incorrects" });
        }

        const user = result.rows[0];

        // Comparer le mot de passe envoyé avec le mot de passe haché dans la base de données
        const match = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!match) {
            return res.status(401).json({ error: "Identifiants incorrects" });
        }

        // Renvoie les informations nécessaires, comme l'ID de l'utilisateur et son rôle
        res.json({
            id_utilisateur: user.id_utilisateur,
            role: user.role,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur serveur");
    }
});
app.post("/api/signup", async (req, res) => {
    const { email, mot_de_passe, fullName, role } = req.body;

    // Vérification des champs obligatoires
    if (!email || !mot_de_passe || !fullName) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        // Vérifier si l'email existe déjà dans la base de données
        const userExists = await pool.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "L'email existe déjà." });
        }

        // Hasher le mot de passe pour le sécuriser avant de le sauvegarder
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insérer l'utilisateur dans la base de données avec son rôle (client par défaut)
        const result = await pool.query(
            "INSERT INTO utilisateurs (email, mot_de_passe, nom, role) VALUES ($1, $2, $3, $4) RETURNING id_utilisateur, role",
            [email, hashedPassword, fullName, role || "client"]
        );

        // Extraire les informations importantes de la réponse
        const { id_utilisateur, role: userRole } = result.rows[0];

        // Retourner une réponse avec les informations de l'utilisateur
        res.status(201).json({
            id_utilisateur,
            role: userRole
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});


// Récupérer tous les chefs de projet
app.get('/chefs', async (req, res) => {
    try {
        // Récupérer l'ID du projet (passé en paramètre)
        const { id_projet } = req.query; // Vous pouvez passer l'id_projet dans la query

        // Récupérer tous les chefs de projet
        const resultChefs = await pool.query('SELECT * FROM utilisateurs WHERE role = $1', ['chef_projet']);

        // Récupérer les chefs déjà assignés à des équipes
        const resultAssignedChefs = await pool.query(
            'SELECT DISTINCT u.id_utilisateur FROM utilisateurs u JOIN equipes e ON e.id_chef_de_projet = u.id_utilisateur'
        );

        // Créer une liste des ids des chefs déjà affectés
        const assignedChefIds = resultAssignedChefs.rows.map(chef => chef.id_utilisateur);

        // Filtrer les chefs qui ne sont pas affectés à une équipe
        const availableChefs = resultChefs.rows.filter(chef => !assignedChefIds.includes(chef.id_utilisateur));

        // Retourner les chefs disponibles
        res.json(availableChefs);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});



//equipe
app.post('/api/equipes', async (req, res) => {
    const { nom_equipe, description, id_projet, id_chef_de_projet } = req.body;
  
    if (!nom_equipe) {
      return res.status(400).json({ message: "Le nom de l'équipe est obligatoire." });
    }
  
    try {
      const result = await pool.query(
        `INSERT INTO equipes (nom_equipe, description,  id_chef_de_projet) 
         VALUES ($1, $2,  $3) RETURNING *`,
        [nom_equipe, description,  id_chef_de_projet]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  });

  app.get('/api/equipes/available', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT * FROM equipes
      `);
      res.json(result.rows);
    } catch (err) {
      console.error('Erreur serveur:', err);
      res.status(500).send('Erreur serveur');
    }
  });
  
  
app.get('/api/equipes', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
  e.*, 
  u.nom AS chef_nom
FROM 
  equipes e
LEFT JOIN utilisateurs u ON e.id_chef_de_projet = u.id_utilisateur;

      `);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  });
  

app.put('/api/equipes/:id', async (req, res) => {
    const { id } = req.params;
    const { nom_equipe, description, id_projet, id_chef_de_projet } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE equipes 
         SET nom_equipe = $1, description = $2, id_projet = $3, id_chef_de_projet = $4
         WHERE id_equipe = $5 RETURNING *`,
        [nom_equipe, description, id_projet, id_chef_de_projet, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Équipe non trouvée." });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipe :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  });
  

app.delete('/equipes/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Requête DELETE reçue pour l'équipe avec ID :", req.params.id);
  
    try {
      const result = await pool.query(
        `DELETE FROM equipes WHERE id_equipe = $1 RETURNING *`,
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Équipe non trouvée." });
      }
  
      res.status(200).json({ message: "Équipe supprimée avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipe :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  });


// GET /chefs/:id_chef/equipe
app.get('/chefs/:id_chef/equipe', async (req, res) => {
  const { id_chef } = req.params;

  try {
    const result = await pool.query(
      `SELECT id_equipe FROM equipes WHERE id_chef_de_projet = $1`,
      [id_chef]
    );

    if (result.rows.length > 0) {
      res.json({ id_equipe: result.rows[0].id_equipe });
    } else {
      res.status(404).send('Aucune équipe trouvée pour ce chef');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

  // GET /equipes/:id_equipe/membres
app.get('/equipes/:id_equipe/membres', async (req, res) => {
  const { id_equipe } = req.params;
  try {
    const membresDisponibles = await pool.query(
      `SELECT * FROM utilisateurs 
       WHERE role = 'membre' 
       AND id_utilisateur NOT IN 
           (SELECT id_utilisateur FROM equipe_membres WHERE id_equipe = $1)`,
      [id_equipe]
    );

    const membresDansEquipe = await pool.query(
      `SELECT u.* FROM utilisateurs u
       INNER JOIN equipe_membres em ON u.id_utilisateur = em.id_utilisateur
       WHERE em.id_equipe = $1`,
      [id_equipe]
    );

    res.json({
      disponibles: membresDisponibles.rows,
      dansEquipe: membresDansEquipe.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// POST /equipes/:id_equipe/membres
app.post('/equipes/:id_equipe/membres', async (req, res) => {
  const { id_equipe } = req.params;
  const { id_utilisateur } = req.body;

  try {
    await pool.query(
      `INSERT INTO equipe_membres (id_equipe, id_utilisateur) VALUES ($1, $2)`,
      [id_equipe, id_utilisateur]
    );
    res.status(201).send('Membre ajouté avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// DELETE /equipes/:id_equipe/membres/:id_utilisateur
app.delete('/equipes/:id_equipe/membres/:id_utilisateur', async (req, res) => {
  const { id_equipe, id_utilisateur } = req.params;

  try {
    await pool.query(
      `DELETE FROM equipe_membres WHERE id_equipe = $1 AND id_utilisateur = $2`,
      [id_equipe, id_utilisateur]
    );
    res.status(200).send('Membre retiré avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

//Tache

app.get('/projets/:idProjet/taches', async (req, res) => {
  const { idProjet } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        t.id_tache, 
        t.nom, 
        t.description, 
        t.date_debut, 
        t.date_fin, 
        t.statut, 
        t.id_projet,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id_utilisateur', tm.id_utilisateur,
              'nom_membre', u.nom
            )
          ) FILTER (WHERE tm.id_utilisateur IS NOT NULL),
          '[]'
        ) AS membres
      FROM taches t
      LEFT JOIN taches_membres tm ON t.id_tache = tm.id_tache
      LEFT JOIN utilisateurs u ON tm.id_utilisateur = u.id_utilisateur
      WHERE t.id_projet = $1
      GROUP BY t.id_tache
      ORDER BY t.id_tache
      `,
      [idProjet]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/taches', async (req, res) => {
  const { nom, description, dateDebut, dateFin, statut, idUtilisateur, idProjet } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO taches (nom, description, date_debut, date_fin, statut, id_utilisateur, id_projet) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nom, description, dateDebut, dateFin, statut, idUtilisateur, idProjet]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.put('/taches/:idTache', async (req, res) => {
  const { idTache } = req.params;
  const { nom, description, date_debut, date_fin, statut, id_utilisateur } = req.body;

  // Vérification que les champs obligatoires sont présents
  if (!nom || !statut) {
    return res.status(400).json({ error: 'Les champs "nom" et "statut" sont obligatoires.' });
  }

  try {
    const result = await pool.query(
      'UPDATE taches SET nom = $1, description = $2, date_debut = $3, date_fin = $4, statut = $5, id_utilisateur = $6 WHERE id_tache = $7 RETURNING *',
      [nom, description, date_debut, date_fin, statut, id_utilisateur, idTache]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tâche non trouvée' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


app.delete('/taches/:idTache', async (req, res) => {
  const { idTache } = req.params;
  try {
    const result = await pool.query('DELETE FROM taches WHERE id_tache = $1 RETURNING *', [idTache]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Tâche non trouvée' });
    } else {
      res.json({ message: 'Tâche supprimée avec succès' });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});




//Projet
app.get('/api/projetschef/:chefId', async (req, res) => {
  const chefId = req.params.chefId;
  try {
    const result = await pool.query(
      `
      SELECT 
  p.*, 
  COALESCE(
    json_agg(
      jsonb_build_object(
        'id_tache', t.id_tache,
        'nom', t.nom,
        'description', t.description,
        'date_debut', TO_CHAR(t.date_debut, 'YYYY-MM-DD'), -- Formater la date de début
        'date_fin', TO_CHAR(t.date_fin, 'YYYY-MM-DD'), -- Formater la date de fin
        'statut', t.statut
      )
    ) FILTER (WHERE t.id_tache IS NOT NULL), 
    '[]'
  ) AS taches
FROM projets p
LEFT JOIN taches t ON t.id_projet = p.id_projet
WHERE p.id_chef_projet = $1
GROUP BY p.id_projet;

`,
      [chefId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération des projets');
  }
});


// Récupérer un projet par son ID
// Récupérer un projet par son ID
app.get('/api/projet/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `SELECT p.*, 
              t.id_tache, 
              t.nom AS tache_nom, 
              t.description AS tache_description, 
              t.date_debut AS tache_date_debut, 
              t.date_fin AS tache_date_fin, 
              t.statut AS tache_statut,
              tm.id_utilisateur AS tache_user_id
       FROM projets p
       LEFT JOIN taches t ON t.id_projet = p.id_projet
       LEFT JOIN taches_membres tm ON tm.id_tache = t.id_tache
       WHERE p.id_projet = $1`,
      [id]
    );

    // Organiser les données en un format souhaité
    const projet = result.rows[0]; // Informations du projet
    const tachesMap = {};

    result.rows.forEach(row => {
      const tacheId = row.id_tache;
      if (!tachesMap[tacheId]) {
        // Initialiser la tâche
        tachesMap[tacheId] = {
          id_tache: row.id_tache,
          nom: row.tache_nom,
          description: row.tache_description,
          date_debut: row.tache_date_debut,
          date_fin: row.tache_date_fin,
          statut: row.tache_statut,
          membres: []
        };
      }

      // Ajouter les membres à la tâche
      if (row.tache_user_id) {
        tachesMap[tacheId].membres.push(row.tache_user_id);
      }
    });

    // Convertir l'objet en tableau de tâches
    const taches = Object.values(tachesMap);

    const projetDetails = {
      ...projet,
      taches
    };

    res.json(projetDetails); // Retourner le projet avec les tâches associées
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la récupération du projet');
  }
});

/*
app.post('/api/tache', async (req, res) => {
  const { nom, description, date_debut, date_fin, id_projet, membres, statut = 'todo' } = req.body;

  // Vérification de la validité des données
  if (!nom || !description || !date_debut || !date_fin || !id_projet || !membres || membres.length === 0) {
      return res.status(400).send('Tous les champs sont requis, y compris les membres.');
  }

  try {
      // Insérer la tâche dans la table `taches`
      const result = await pool.query(
          `INSERT INTO taches (nom, description, date_debut, date_fin, id_projet, statut) 
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_tache`,
          [nom, description, date_debut, date_fin, id_projet, statut]
      );

      const id_tache = result.rows[0].id_tache;

      // Ajouter les membres dans la table `taches_membres`
      const membreInsertQuery = `
          INSERT INTO taches_membres (id_tache, id_utilisateur)
          VALUES ($1, $2)
      `;
      for (let membreId of membres) {
          await pool.query(membreInsertQuery, [id_tache, membreId]);
      }

      // Mettre à jour le statut du projet si ce n'est pas déjà "in progress"
      const checkProjetStatusQuery = `
          SELECT statut FROM projets WHERE id_projet = $1
      `;
      const projectResult = await pool.query(checkProjetStatusQuery, [id_projet]);
      const currentStatus = projectResult.rows[0].statut;

      if (currentStatus === 'accepted') {
          const updateProjetStatusQuery = `
              UPDATE projets SET statut = 'in progress' WHERE id_projet = $1
          `;
          await pool.query(updateProjetStatusQuery, [id_projet]);
      }

      res.status(201).json({ message: 'Tâche créée avec succès', id_tache });
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la création de la tâche');
  }
});

*/
app.post('/api/tache', async (req, res) => {
  const { nom, description, date_debut, date_fin, id_projet, membres, statut = 'todo' } = req.body;

  // Vérification de la validité des données
  if (!nom || !description || !date_debut || !date_fin || !id_projet || !membres || membres.length === 0) {
    return res.status(400).send('Tous les champs sont requis, y compris les membres.');
  }

  const client = await pool.connect(); // Obtient une connexion au client
  try {
    await client.query('BEGIN'); // Démarre la transaction

    // Insérer la tâche dans la table `taches`
    const result = await client.query(
      `INSERT INTO taches (nom, description, date_debut, date_fin, id_projet, statut) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_tache`,
      [nom, description, date_debut, date_fin, id_projet, statut]
    );

    const id_tache = result.rows[0].id_tache;

    // Ajouter les membres dans la table `taches_membres`
    const membreInsertQuery = `
      INSERT INTO taches_membres (id_tache, id_utilisateur)
      VALUES ($1, $2)
    `;
    for (let membreId of membres) {
      await client.query(membreInsertQuery, [id_tache, membreId]);

      // Insérer une notification pour chaque membre
      const notificationMessage = `Une nouvelle tâche "${nom}" vous a été assignée pour le projet ID ${id_projet}.`;
      await client.query(
        `INSERT INTO notifications (message, type, id_utilisateur, id_projet, id_tache, lu, date_envoi, destinataire) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)`,
        [
          notificationMessage,  // Message de la notification
          'Attribution',        // Type de notification
          membreId,             // ID du membre assigné
          id_projet,            // ID du projet
          id_tache,             // ID de la tâche
          false,                // Non lu par défaut
          'Membre'              // Destinataire (rôle)
        ]
      );
    }

    // Mettre à jour le statut du projet si ce n'est pas déjà "in progress"
    const checkProjetStatusQuery = `
      SELECT statut FROM projets WHERE id_projet = $1
    `;
    const projectResult = await client.query(checkProjetStatusQuery, [id_projet]);
    const currentStatus = projectResult.rows[0].statut;

    if (currentStatus === 'accepted') {
      const updateProjetStatusQuery = `
        UPDATE projets SET statut = 'in progress' WHERE id_projet = $1
      `;
      await client.query(updateProjetStatusQuery, [id_projet]);
    }

    // Commit de la transaction
    await client.query('COMMIT');

    res.status(201).json({ message: 'Tâche créée avec succès, notifications envoyées', id_tache });
  } catch (error) {
    await client.query('ROLLBACK'); // Annule toutes les opérations en cas d'erreur
    console.error(error);
    res.status(500).send('Erreur lors de la création de la tâche');
  } finally {
    client.release(); // Libère la connexion
  }
});




// Supprimer une tâche par son ID
app.delete('/api/tache/:id', async (req, res) => {
  const id_tache = req.params.id;
  try {
    // Supprimer la tâche (les relations seront supprimées automatiquement grâce à ON DELETE CASCADE)
    const result = await pool.query('DELETE FROM taches WHERE id_tache = $1 RETURNING *', [id_tache]);

    if (result.rowCount === 0) {
      return res.status(404).send('Tâche non trouvée');
    }

    res.status(200).send(`Tâche avec l'ID ${id_tache} supprimée avec succès`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la suppression de la tâche');
  }
});

app.put('/api/tache/:id', async (req, res) => {
  const id_tache = req.params.id; // Récupérer l'ID de la tâche à modifier
  const { nom, description, date_debut, date_fin, statut, membres } = req.body;

  try {
    const statutValue = statut || 'todo'; // Valeur par défaut pour le statut

    // Démarrer une transaction
    await pool.query('BEGIN');

    // Mettre à jour la tâche
    const updateTacheQuery = `
      UPDATE taches
      SET nom = $1, description = $2, date_debut = $3, date_fin = $4, statut = $5
      WHERE id_tache = $6
      RETURNING *
    `;
    const updateTacheValues = [nom, description, date_debut, date_fin, statutValue, id_tache];
    const updateTacheResult = await pool.query(updateTacheQuery, updateTacheValues);

    // Vérifier si la tâche existe
    if (updateTacheResult.rowCount === 0) {
      throw new Error('Tâche non trouvée');
    }

    // Mettre à jour les membres associés
    if (Array.isArray(membres)) {
      // Supprimer les membres existants pour cette tâche
      await pool.query('DELETE FROM taches_membres WHERE id_tache = $1', [id_tache]);

      // Ajouter les nouveaux membres
      const insertMembreQuery = `
        INSERT INTO taches_membres (id_tache, id_utilisateur)
        VALUES ($1, $2)
      `;
      for (const membreId of membres) {
        await pool.query(insertMembreQuery, [id_tache, membreId]);
      }
    }

    // Valider la transaction
    await pool.query('COMMIT');

    res.status(200).json({ message: 'Tâche mise à jour avec succès' });

  } catch (error) {
    // En cas d'erreur, annuler la transaction
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).send('Erreur lors de la mise à jour de la tâche');
  }
});


// Endpoint pour marquer un projet comme terminé
app.put('/api/projets/:id/completed', async (req, res) => {
  try {
      const { id } = req.params;

      // Vérifier si toutes les tâches du projet sont terminées
      const taches = await pool.query('SELECT statut FROM taches WHERE id_projet = $1', [id]);

      const toutesTachesTerminees = taches.rows.every((tache) => tache.statut === 'completed');

      if (!toutesTachesTerminees) {
          return res.status(400).json({
              error: 'Toutes les tâches doivent être terminées avant de marquer le projet comme terminé.',
          });
      }

      // Marquer le projet comme terminé
      await pool.query('UPDATE projets SET statut = $1 WHERE id_projet = $2', ['in review',id]);
      const ADMIN_USER_ID = 42;

      // Envoyer une notification à l'administrateur
      await pool.query(
        `INSERT INTO notifications (message, date_envoi, type, id_utilisateur, id_projet, destinataire)
         VALUES ($1, NOW(), $2, $3, $4, $5)`,
        [
            `Le projet avec l'ID ${id} a été terminé.`,
            'Fin_de_projet', // Utiliser un type valide
            ADMIN_USER_ID, // Remplacez par l'ID de l'administrateur
            id,
            'Admin' // Destinataire
        ]
    );
      res.json({ message: 'Projet marqué comme terminé avec succès.' });
  } catch (error) {
      console.error('Erreur lors de la mise à jour du projet :', error);
      res.status(500).json({ error: 'Erreur serveur.' });
  }
});

app.get('/api/projetclient/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // Requête pour récupérer les projets associés au client
    const result = await pool.query(
      `SELECT id_projet, nom, description, date_debut, date_fin, statut
       FROM projets
       WHERE id_client = $1
       ORDER BY date_debut DESC`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Aucun projet trouvé pour ce client." });
    }

    // Retourner les projets au frontend
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
app.get('/api/ntf/client/:userId', async (req, res) => {
  const { userId } = req.params; // Récupère l'ID utilisateur à partir de l'URL

  try {
    // Récupérer les notifications pour le client (id_utilisateur)
    const query = `
      SELECT id_notification, message, date_envoi, type, id_utilisateur, id_projet, lu
      FROM notifications
      WHERE id_utilisateur = $1
      ORDER BY date_envoi DESC;
    `;
    const { rows } = await pool.query(query, [userId]); // Exécuter la requête

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Aucune notification trouvée pour ce client.' });
    }

    // Retourne les notifications sous forme de réponse JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
// GET /api/tasks/member/:id
app.get('/api/tasks/member/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const tasks = await pool.query(
      'SELECT * FROM taches WHERE id_tache IN (SELECT id_tache FROM taches_membres WHERE id_utilisateur = $1)',
      [id]
    );

    res.json(tasks.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).send('Erreur serveur');
  }
});
/*
app.put('/api/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { statut } = req.body;

  // Vérifier que le statut est fourni
  if (!statut) {
    return res.status(400).json({ error: 'Le statut doit être fourni' });
  }

  try {
    // Effectuer la mise à jour du statut dans la base de données
    const query = `
      UPDATE taches
      SET statut = $1
      WHERE id_tache = $2
      RETURNING *;
    `;
    const values = [statut, taskId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    // Renvoyer la tâche mise à jour
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});*/
app.put('/api/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { statut } = req.body;

  // Vérifier que le statut est fourni
  if (!statut) {
    return res.status(400).json({ error: 'Le statut doit être fourni' });
  }

  try {
    // Mettre à jour le statut de la tâche dans la base de données
    const updateTaskQuery = `
      UPDATE taches
      SET statut = $1
      WHERE id_tache = $2
      RETURNING *;
    `;
    const taskUpdateResult = await pool.query(updateTaskQuery, [statut, taskId]);

    if (taskUpdateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    const updatedTask = taskUpdateResult.rows[0];

    // Récupérer le projet et le chef de projet associé à cette tâche
    const getChefQuery = `
      SELECT p.id_chef_projet, p.id_projet, p.nom AS projet_nom, t.nom AS tache_nom
      FROM taches t
      JOIN projets p ON t.id_projet = p.id_projet
      WHERE t.id_tache = $1
    `;
    const chefResult = await pool.query(getChefQuery, [taskId]);

    if (chefResult.rows.length === 0) {
      return res.status(404).json({ error: 'Aucun chef de projet trouvé pour cette tâche.' });
    }

    const { id_chef_projet, id_projet, projet_nom, tache_nom } = chefResult.rows[0];

    // Créer une notification pour le chef de projet
    const insertNotificationQuery = `
      INSERT INTO notifications (message, type, id_utilisateur, id_projet, lu, destinataire)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

    const notificationMessage = `Le statut de la tâche "${tache_nom}" dans le projet "${projet_nom}" a été mis à jour à "${statut}".`;

    await pool.query(insertNotificationQuery, [
      notificationMessage,  // Message de notification
      'Tache',              // Type de notification
      id_chef_projet,       // ID du chef de projet
      id_projet,            // ID du projet
      false,                // Non lu par défaut
      'Chef'                // Destinataire (rôle)
    ]);

    // Renvoyer la tâche mise à jour
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});


// Route : GET /api/projects/member/:userId
app.get('/api/projects/member/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const projects = await pool.query(
      `
      SELECT p.id_projet, p.nom, p.description, p.statut
      FROM projets p
      JOIN equipes e ON p.id_chef_projet = e.id_chef_de_projet
      JOIN equipe_membres em ON e.id_equipe = em.id_equipe
      WHERE em.id_utilisateur = $1
      `,
      [userId]
    );

    res.status(200).json(projects.rows); // Retourne les projets sous forme de tableau JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des projets du membre :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des projets." });
  }
});

// Route : GET /api/projects/:projectId/details
app.get('/api/projects/:projectId/details', async (req, res) => {
  const { projectId } = req.params;

  try {
    // Récupérer les informations de base du projet, y compris les chemins d'image et de document
    const project = await pool.query(
      `
      SELECT p.id_projet, p.nom, p.description, p.statut, p.date_debut, p.date_fin,
             p.id_chef_projet, u.nom AS chef_de_projet, p.image_path, p.document_path
      FROM projets p
      JOIN utilisateurs u ON p.id_chef_projet = u.id_utilisateur
      WHERE p.id_projet = $1
      `,
      [projectId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ error: "Projet non trouvé." });
    }

    const projectData = project.rows[0];

    // Récupérer les tâches du projet
    const tasks = await pool.query(
      `
      SELECT t.id_tache, t.nom, t.statut, 
             array_agg(u.nom) AS assigne_au_membre -- Récupère les membres assignés à chaque tâche
      FROM taches t
      LEFT JOIN taches_membres tm ON t.id_tache = tm.id_tache
      LEFT JOIN utilisateurs u ON tm.id_utilisateur = u.id_utilisateur
      WHERE t.id_projet = $1
      GROUP BY t.id_tache
      `,
      [projectId]
    );

    // Récupérer les membres de l'équipe du projet
    const teamMembers = await pool.query(
      `
      SELECT u.id_utilisateur, u.nom
      FROM utilisateurs u
      JOIN equipe_membres em ON u.id_utilisateur = em.id_utilisateur
      JOIN equipes e ON em.id_equipe = e.id_equipe
      JOIN projets p ON e.id_chef_de_projet = p.id_chef_projet
      WHERE p.id_projet = $1
      `,
      [projectId]
    );

    // Construire l'objet de réponse
    const response = {
      ...projectData,
      taches: tasks.rows,
      membres_equipe: teamMembers.rows,
    };

    res.status(200).json(response); // Retourne les détails du projet avec ses tâches, membres et documents
  } catch (error) {
    console.error("Erreur lors de la récupération des détails du projet :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des détails du projet." });
  }
});
/*
require('dotenv').config();

const nodemailer = require('nodemailer');

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Utilise Gmail ou tout autre service SMTP
  auth: {
    user: process.env.EMAIL_USER, // Adresse email d'envoi
    pass: process.env.EMAIL_PASSWORD, // Mot de passe ou token de l'application
  },
});

const sendEmailNotification = (toEmail, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
    } else {
      console.log('Email envoyé : ' + info.response);
    }
  });
};

module.exports = { sendEmailNotification };


*/

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
