import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, CircularProgress, Box, Paper } from '@mui/material';
import axios from 'axios';

export default function MemberTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const backendURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const userId = localStorage.getItem('userId');

  // Charger les tâches du membre
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/tasks/member/${userId}`);
        setTasks(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  // Mettre à jour le statut de la tâche
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(`${backendURL}/api/tasks/${taskId}`, { statut: newStatus });
      const updatedTask = response.data;
  
      // Met à jour la liste des tâches avec le nouveau statut
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id_tache === taskId ? { ...task, statut: updatedTask.statut } : task
        )
      );
  
      // Retourne à la liste des tâches après la mise à jour
      setSelectedTask(null);
  
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };
  

  // Afficher les détails d'une tâche
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  // Chargement
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  // Fonction pour colorier le statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'orange';
      case 'completed':
        return 'green';
      case 'todo':
        return 'gray';
      default:
        return 'black';
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start" // Ajuste cette ligne pour que la liste soit plus haut
      marginTop="20px" // Ajoute un espacement par rapport au haut de l'écran
      height="100vh"
    >
      {/* Affichage de la liste des tâches ou des détails de la tâche sélectionnée */}
      {!selectedTask ? (
        <Paper style={{ padding: '20px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h4" align="center" gutterBottom>
           
          </Typography>
          <List style={{ padding: 0, align:'center', }}>
            {tasks.map((task) => (
              <ListItem
                key={task.id_tache}
                divider
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  transition: 'background-color 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => handleTaskClick(task)}
              >
                <ListItemText
                  primary={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <Typography variant="body1" style={{ marginRight: '15px', whiteSpace: 'nowrap' }}>
                        <strong>Nom:</strong> {task.nom}
                      </Typography>
                      <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                        <Typography variant="body2" style={{ marginRight: '10px' }}>
                          <strong>Date début:</strong> {task.date_debut}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date fin:</strong> {task.date_fin}
                        </Typography>
                      </div>
                      <Typography
                        variant="body2"
                        style={{
                          color: getStatusColor(task.statut),
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <strong>Statut:</strong> {task.statut === 'in_progress' ? 'En cours' : task.statut === 'completed' ? 'Terminée' : 'Non commencée'}
                      </Typography>
                    </div>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Paper
        style={{
          padding: '20px',
          width: '100%', // Ajuste la largeur de la carte (peut être plus grande ou plus petite)
          maxWidth: '800px', // Largeur maximale de la carte
          maxHeight: '80vh', // Hauteur maximale
          overflowY: 'auto',
          margin: 'auto', // Centre horizontalement
          marginTop: '20px', // Espacement supérieur
        }}
      >
        <Typography variant="h4" align="center">Détails de la Tâche</Typography>
        <Typography variant="h6">
          <strong>Nom:</strong> {selectedTask.nom}
        </Typography>
        <Typography variant="body1">
          <strong>Description:</strong> {selectedTask.description}
        </Typography>
        <Typography variant="body1">
          <strong>Date début:</strong> {selectedTask.date_debut}
        </Typography>
        <Typography variant="body1">
          <strong>Date fin:</strong> {selectedTask.date_fin}
        </Typography>
        <Typography variant="body2">
          <strong>Statut:</strong>{' '}
          <span style={{ color: getStatusColor(selectedTask.statut) }}>
            {selectedTask.statut === 'in_progress' ? 'En cours' : 'Non commencée'}
          </span>
        </Typography>
      
        {/* Afficher les boutons en fonction du statut */}
        {selectedTask.statut === 'todo' && (
  <Box marginTop="10px" textAlign="center">
    <button
      style={{
        padding: '10px 20px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
      onClick={() => updateTaskStatus(selectedTask.id_tache, 'in_progress')}
    >
      Commencer
    </button>
  </Box>
)}
{selectedTask.statut === 'in_progress' && (
  <Box marginTop="10px" textAlign="center">
    <button
      style={{
        padding: '10px 20px',
        backgroundColor: '#388e3c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
      onClick={() => updateTaskStatus(selectedTask.id_tache, 'completed')}
    >
      Terminer
    </button>
  </Box>
)}

        <Box marginTop="10px" textAlign="center">
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedTask(null)} // Pour revenir à la liste
          >
            Retour à la liste
          </button>
        </Box>
      </Paper>
      
      )}
    </Box>
  );
}
