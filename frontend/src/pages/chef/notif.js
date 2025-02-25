import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, Button, Snackbar, Alert } from '@mui/material';

const NotificationsClient = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const backendURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const userId = localStorage.getItem('userId');

  // Fonction pour charger les notifications
  const fetchNotifications = async () => {
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    try {
      const response = await axios.get(`${backendURL}/api/notifications/${userId}`);
      setNotifications(response.data);
      setLoading(false);

      // Calcul du nombre de notifications non lues
      const unreadCount = response.data.filter(notification => !notification.lu).length;

      // Affichage du Snackbar avec le nombre de notifications non lues
      if (unreadCount > 0) {
        setSnackbarMessage(`Vous avez ${unreadCount} nouvelle(s) notification(s) non lue(s)`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId, backendURL]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    handleMarkAsRead(notification.id_notification); // Marque la notification comme lue
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${backendURL}/api/notifications/${id}`);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id_notification === id
            ? { ...notification, lu: true, date_lecture: new Date().toISOString() }
            : notification
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification', error);
    }
  };

  const handleBackToList = () => {
    setSelectedNotification(null); // Réinitialise la notification sélectionnée
    fetchNotifications(); // Rafraîchit la liste des notifications
  };

  if (loading) {
    return <div>Chargement des notifications...</div>;
  }

  return (
    <Box sx={{ height: '100%', width: '100%', overflowY: 'auto', padding: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, display: 'flex', flexDirection: 'column' }}>
      {selectedNotification ? (
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToList}
            sx={{ marginBottom: 2 }}
          >
            Retour à la liste
          </Button>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Détails de la Notification
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <strong>Message :</strong> {selectedNotification.message}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            <strong>Reçu le :</strong> {new Date(selectedNotification.date_envoi).toLocaleString()}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Mes Notifications
          </Typography>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id_notification}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.lu ? 'transparent' : '#e3f2fd', // Bleu clair si non lue, transparent si lue
                  marginBottom: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: notification.lu ? 'transparent' : '#bbdefb', // Effet de survol avec bleu pour non lue
                  },
                }}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={`Reçu le : ${new Date(
                    notification.date_envoi
                  ).toLocaleDateString()} ${new Date(
                    notification.date_envoi
                  ).toLocaleTimeString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationsClient;
