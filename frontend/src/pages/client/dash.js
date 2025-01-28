import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Card, CardContent, Grid, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardClient = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      try {
        const projetsResponse = await axios.get(
          `${backendURL}/api/projetclient/${userId}`
        );
        console.log("Projets:", projetsResponse.data); // Vérifier la réponse des projets

        setProjets(projetsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Statistiques : Nombre total de projets
  const totalProjets = projets.length;

  // Répartition des projets par statut
  const statutCounts = projets.reduce((acc, projet) => {
    // Mapper les statuts du backend vers les statuts attendus par le graphique
    const statut = projet.statut;
    if (statut === 'accepted') {
      acc['Accepted'] = (acc['Accepted'] || 0) + 1;
    } else if (statut === 'in progress') {
      acc['In Progress'] = (acc['In Progress'] || 0) + 1;
    } else if (statut === 'completed') {
      acc['Completed'] = (acc['Completed'] || 0) + 1;
    } else if (statut === 'rejected') {
      acc['Rejected'] = (acc['Rejected'] || 0) + 1;
    }
    return acc;
  }, {});

  const statutData = {
    labels: ['Accepted', 'In Progress', 'Completed', 'Rejected'],
    datasets: [
      {
        data: [
          statutCounts.Accepted || 0,
          statutCounts['In Progress'] || 0,
          statutCounts.Completed || 0,
          statutCounts.Rejected || 0
        ],
        backgroundColor: ['#ffbb33', '#2196f3', '#4caf50', '#ff5722'],
        borderWidth: 1,
      },
    ],
  };

  // Dernières mises à jour sur les projets
  const recentProjects = projets.slice(0, 5); // Limite à 5 projets récents

  return (
    <Box sx={{ padding: 2 }}>
      {/* Titre du tableau de bord */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        
      </Typography>

      {/* Grille pour les statistiques */}
      <Grid container spacing={3}>
        {/* Nombre total de projets */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Nombre Total de Projets
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {totalProjets}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Répartition des statuts des projets */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Répartition des Statuts
              </Typography>
              <Pie data={statutData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Dernières mises à jour des projets */}
        <Grid item xs={12} sm={12} md={4}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Dernières Mises à Jour
              </Typography>
              <List>
                {recentProjects.map((projet, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={projet.nom}
                      secondary={`Statut : ${projet.statut} | Dernière mise à jour : ${new Date(projet.updatedAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardClient;
