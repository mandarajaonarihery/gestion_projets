import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Card, CardContent, Grid, Typography, Box, LinearProgress } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Enregistre les composants nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const chefId = userId;
  const backendURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/projetschef/${chefId}`);
        setProjets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des projets', error);
        setLoading(false);
      }
    };

    fetchProjets();
  }, [chefId, backendURL]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Statistiques : Répartition des statuts des projets
  const statutCounts = projets.reduce((acc, projet) => {
    acc[projet.statut] = (acc[projet.statut] || 0) + 1;
    return acc;
  }, {});

  const statutData = {
    labels: ['Pending', 'In Progress', 'Completed', 'Accepted', 'Rejected'],
    datasets: [
      {
        data: [
          statutCounts.pending || 0,
          statutCounts['in progress'] || 0,
          statutCounts.completed || 0,
          statutCounts.accepted || 0,
          statutCounts.rejected || 0,
        ],
        backgroundColor: ['#ffbb33', '#4caf50', '#2196f3', '#ff5722', '#9e9e9e'],
        borderWidth: 1,
      },
    ],
  };

  // Statistiques : Nombre de tâches complètes vs en cours
  const completedTasksCount = projets.reduce(
    (count, projet) => count + projet.taches.filter((tache) => tache.statut === 'completed').length,
    0
  );

  const inProgressTasksCount = projets.reduce(
    (count, projet) => count + projet.taches.filter((tache) => tache.statut === 'in_progress').length,
    0
  );

  const taskCounts = {
    labels: ['Completed', 'In Progress'],
    datasets: [
      {
        label: 'Tâches',
        data: [completedTasksCount, inProgressTasksCount],
        backgroundColor: ['#4caf50', '#2196f3'],
        borderWidth: 1,
      },
    ],
  };

  // Calcul de la progression (en pourcentage) des tâches
  const totalTasks = completedTasksCount + inProgressTasksCount;
  const taskProgress = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  return (
    <div className="p-4">
      {/* Affichage des diagrammes */}
      <Grid container spacing={3}>
        {/* Diagramme Circulaire pour la répartition des statuts des projets */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Répartition des Statuts des Projets
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pie
                  data={statutData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                        },
                      },
                      tooltip: {
                        enabled: true,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Diagramme en Barres pour le nombre de tâches complètes vs en cours */}
        <Grid item xs={12} sm={6} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Statistiques des Tâches
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', height: 250 }}>
                <Bar
                  data={taskCounts}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        enabled: true,
                      },
                    },
                  }}
                />
              </Box>
              {/* Barre de progression dynamique */}
              <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Progression des tâches
                </Typography>
                <LinearProgress
                  sx={{ marginTop: 1 }}
                  variant="determinate"
                  value={taskProgress}
                />
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                  {Math.round(taskProgress)}% Complètes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
