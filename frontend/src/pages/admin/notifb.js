import { useState, useEffect } from 'react';
import axios from 'axios';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

function NotificationsBadge() {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        // Appel à l'endpoint pour récupérer les notifications non lues
        const response = await axios.get(`${backendURL}/api/notifications/unread`);
        setUnreadNotifications(response.data.length);  // Nombre de notifications non lues
      } catch (err) {
        console.error('Erreur lors de la récupération des notifications:', err);
      }
    };

    fetchUnreadNotifications();
  }, []);  // Appel initial au chargement du composant

  return (
    <Badge badgeContent={unreadNotifications} color="error">
      <NotificationsIcon />
    </Badge>
  );
}

export default NotificationsBadge;
