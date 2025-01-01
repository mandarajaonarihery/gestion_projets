import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Card, CardContent, Grid, Typography, Box ,LinearProgress} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
    
// Enregistre les composants nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DashboardAdmin = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/projets`); // Récupère tous les projets pour l'admin
        setProjets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des projets', error);
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Statistiques : Nombre total de projets
  const totalProjets = projets.length;

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
          statutCounts.rejected || 0
        ],
        backgroundColor: ['#ffbb33', '#4caf50', '#2196f3', '#ff5722', '#9e9e9e'],
        borderWidth: 1,
      },
    ],
  };

  // Statistiques : Nombre total de tâches complètes vs en cours
  const taskCounts = {
    labels: ['Completed', 'In Progress'],
    datasets: [
      {
        label: 'Tâches',
        data: [
          projets.filter((projet) => projet.statut === 'completed').length, // Tâches complètes
          projets.filter((projet) => projet.statut === 'in progress').length, // Tâches en cours
        ],
        backgroundColor: ['#4caf50', '#2196f3'],
        borderWidth: 1,
      },
    ],
  };

  // Statistiques : Nombre de projets acceptés vs rejetés
  const projetsAccepteesRejetees = {
    labels: ['Acceptees', 'Rejetees'],
    datasets: [
      {
        data: [
          projets.filter((projet) => projet.statut === 'accepted').length, // Projets acceptés
          projets.filter((projet) => projet.statut === 'rejected').length, // Projets rejetés
        ],
        backgroundColor: ['#4caf50', '#ff5722'],
        borderWidth: 1,
      },
    ],
  };


    
    
return (
  <Box sx={{ padding: 2 }}>
    {/* Titre du Dashboard */}
    <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
      Tableau de Bord - Statistiques
    </Typography>

    {/* Disposition des cartes avec statistiques */}
    <Grid container spacing={3}>
      {/* Nombre total de projets */}
      <Grid item xs={12} sm={6} md={6}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <WorkOutlineIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Nombre Total de Projets
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
              {totalProjets}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Projets en cours de gestion actuellement.
            </Typography>
            {/* Barre de progression */}
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">Progression globale</Typography>
              <LinearProgress variant="determinate" value={60} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Diagramme Circulaire pour la répartition des statuts des projets */}
      <Grid item xs={12} sm={6} md={6}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
              Répartition des Statuts des Projets
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie
                data={statutData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom', // Place les légendes en bas
                      labels: {
                        boxWidth: 15, // Taille des carrés de couleur
                        padding: 15,
                      },
                    },
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Autres cartes avec diagrammes */}
      <Grid item xs={12} sm={6} md={6}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Statistiques des Tâches
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <Bar data={taskCounts} options={{ responsive: true }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Projets Acceptés vs Rejetés */}
      <Grid item xs={12} sm={6} md={6}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Projets Acceptés vs Rejetés
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <Bar data={projetsAccepteesRejetees} options={{ responsive: true }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);
      
};

export default DashboardAdmin;
