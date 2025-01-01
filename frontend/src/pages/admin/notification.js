import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Box,
  Snackbar,
  Skeleton,
  Button,
  IconButton,
  useTheme,
  TextField,
  Alert,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [status, setStatus] = useState('');
  const [cause, setCause] = useState(''); // Ajouté ici
  const theme = useTheme();
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notifications`);
        setNotifications(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des notifications:', err);
        setError("Impossible de récupérer les notifications.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${id}`);
      setNotifications(
        notifications.map((notification) =>
          notification.id_notification === id ? { ...notification, lu: true } : notification
        )
      );

      const notification = notifications.find((notification) => notification.id_notification === id);
      const projectId = notification?.id_projet;

      if (projectId) {
        const response = await axios.get(`${backendURL}/api/projets/${projectId}`);
        setSelectedProject(response.data);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la notification:', err);
      setError("Impossible de marquer la notification comme lue.");
    }
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  const handleAcceptProject = async () => {
    try {
      await axios.put(`http://localhost:5000/api/projets/${selectedProject.id_projet}`, {
        statut: 'accepted',
      });
      setStatus('accepted');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erreur lors de l'acceptation du projet :", error);
    }
  };

  const handleRejectProject = async () => {
    if (!cause.trim()) {
      alert('Veuillez indiquer la cause du refus.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/projets/${selectedProject.id_projet}`, {
        statut: 'rejected',
        raison_refus: cause,
      });
      setStatus('rejected');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erreur lors du refus du projet :", error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        padding: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {selectedProject ? (
        <Box>
          <Button onClick={handleBackToList} variant="contained" sx={{ marginBottom: 2 }}>
            Retour à la liste
          </Button>
          <Typography variant="h5" gutterBottom>Détails du projet</Typography>
          <Typography><strong>Nom :</strong> {selectedProject.nom}</Typography>
          <Typography><strong>Description :</strong> {selectedProject.description}</Typography>
          <Typography><strong>Date de début :</strong> {new Date(selectedProject.date_debut).toLocaleDateString()}</Typography>
          <Typography><strong>Date de fin :</strong> {new Date(selectedProject.date_fin).toLocaleDateString()}</Typography>

          {selectedProject.image_path && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Image :</Typography>
              <img
                src={`${backendURL}/${selectedProject.image_path}`}
                alt="Projet"
                style={{ width: '100%', maxWidth: 400, borderRadius: 8 }}
              />
            </Box>
          )}

          {selectedProject.document_path && (
            <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">Document :</Typography>
              <IconButton
                href={`${backendURL}/${selectedProject.document_path}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ marginLeft: 1 }}
              >
                <DownloadIcon />
              </IconButton>
            </Box>
          )}
          <Box sx={{ marginTop: 2 }}>
            <Button onClick={handleAcceptProject} variant="contained" color="success">
              Accepter
            </Button>
            <Button onClick={handleRejectProject} variant="contained" color="error" sx={{ marginLeft: 2 }}>
              Refuser
            </Button>
            <TextField
              label="Cause du refus"
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              sx={{ marginTop: 2 }}
              fullWidth
            />
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>Notifications</Typography>
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}

          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={200} />
          ) : (
            <List>
              {notifications.map((notification) => (
                <div key={notification.id_notification}>
                  <List>
  {notifications.map((notification) => (
    <div key={notification.id_notification}>
      <ListItem
        sx={{
          borderLeft: notification.lu ? 'none' : `4px solid ${theme.palette.primary.main}`,
          cursor: 'pointer',
          backgroundColor: notification.lu
            ? theme.palette.background.default
            : theme.palette.mode === 'dark'
            ? theme.palette.primary.dark  // Couleur plus foncée en mode sombre
            : '#003c6c',                   // Bleu clair pour mode clair
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
        onClick={() => handleNotificationClick(notification.id_notification)}
      >
        <ListItemText
          primary={notification.message}
          secondary={new Date(notification.date_envoi).toLocaleString()}
          primaryTypographyProps={{
            fontWeight: notification.lu ? 'normal' : 'bold',
          }}
        />
      </ListItem>
      <Divider />
    </div>
  ))}
</List>

                  <Divider />
                </div>
              ))}
            </List>
          )}
        </Box>
      )}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Statut du projet mis à jour avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default NotificationsList;
