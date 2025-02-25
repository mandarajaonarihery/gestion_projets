import axios from 'axios';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from 'react';

function NotificationsBadge() {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const backendURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        // Vérifier si l'URL du backend est définie
        if (!backendURL) {
          console.error('L\'URL du backend est manquante dans les variables d\'environnement.');
          return;
        }

        // Récupérer l'ID utilisateur depuis le localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('ID utilisateur manquant dans le localStorage.');
          return;
        }

        // Appeler le backend pour récupérer les notifications non lues
        const response = await axios.get(`${backendURL}/api/notifications/unread`, {
          params: { userId }, // Envoi de l'ID utilisateur comme paramètre
        });

        // Mettre à jour le nombre de notifications non lues
        setUnreadNotifications(response.data.length);
      } catch (err) {
        console.error('Erreur lors de la récupération des notifications :', err);
      }
    };

    fetchUnreadNotifications();
  }, [backendURL]); // Dépendance : réexécuter si l'URL backend change

  return (
    <Badge
      badgeContent={unreadNotifications}
      color="error"
      aria-label={`Vous avez ${unreadNotifications} notifications non lues`}
    >
      <NotificationsIcon />
    </Badge>
  );
}

export default NotificationsBadge;
