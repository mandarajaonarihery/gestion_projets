import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Projectclient = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('statut');
  const [filterStatut, setFilterStatut] = useState('');
  const userId = localStorage.getItem('userId'); // On récupère l'ID du client depuis le localStorage
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      try {
        const response = await axios.get(`${backendURL}/api/projetclient/${userId}`);
        setProjets(response.data); // On stocke la liste des projets du client
        setLoading(false); // On met à jour l'état de chargement
      } catch (error) {
        console.error('Erreur lors du chargement des projets', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Filtrer les projets par statut et par recherche
  const filteredProjets = projets.filter(projet => 
    projet.nom.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterStatut ? projet.statut === filterStatut : true)
  );

  // Trier les projets par statut
  const sortedProjets = filteredProjets.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Projets Commandés
      </Typography>

      {/* Barre de recherche */}
      <TextField
        label="Rechercher un projet"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
        InputProps={{
          endAdornment: (
            <IconButton edge="end">
              <SearchIcon />
            </IconButton>
          ),
        }}
      />

      {/* Filtre par statut */}
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="statut-select-label">Statut</InputLabel>
        <Select
          labelId="statut-select-label"
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
          label="Statut"
        >
          <MenuItem value="">
            <em>Tous</em>
          </MenuItem>
          <MenuItem value="pending">En attente</MenuItem>
          <MenuItem value="in progress">En cours</MenuItem>
          <MenuItem value="completed">Terminé</MenuItem>
          <MenuItem value="accepted">Accepté</MenuItem>
          <MenuItem value="rejected">Rejeté</MenuItem>
        </Select>
      </FormControl>

      {/* Liste des projets commandés par le client */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ boxShadow: 3, borderRadius: 2, padding: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Liste des Projets Commandés
            </Typography>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table sx={{ minWidth: 850 }} aria-label="table des projets">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '20%' }}>
                      <TableSortLabel
                        active={sortBy === 'nom'}
                        direction={sortBy === 'nom' ? sortOrder : 'asc'}
                        onClick={() => handleRequestSort('nom')}
                      >
                        Nom du Projet
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: '15%' }}>
                      <TableSortLabel
                        active={sortBy === 'statut'}
                        direction={sortBy === 'statut' ? sortOrder : 'asc'}
                        onClick={() => handleRequestSort('statut')}
                      >
                        Statut
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: '15%' }}>
                      <TableSortLabel
                        active={sortBy === 'date_debut'}
                        direction={sortBy === 'date_debut' ? sortOrder : 'asc'}
                        onClick={() => handleRequestSort('date_debut')}
                      >
                        Date de Début
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: '15%' }}>
                      <TableSortLabel
                        active={sortBy === 'date_fin'}
                        direction={sortBy === 'date_fin' ? sortOrder : 'asc'}
                        onClick={() => handleRequestSort('date_fin')}
                      >
                        Date de Fin
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ width: '35%' }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProjets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Aucun projet commandé pour le moment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedProjets.map((projet) => (
                      <TableRow key={projet.id_projet}>
                        <TableCell>{projet.nom}</TableCell>
                        <TableCell>{projet.statut}</TableCell>
                        <TableCell>{new Date(projet.date_debut).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(projet.date_fin).toLocaleDateString()}</TableCell>
                        <TableCell>{projet.description}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Projectclient;
