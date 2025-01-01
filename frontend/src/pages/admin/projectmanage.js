import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Snackbar,
  Alert,
  TextField
} from '@mui/material';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';

export default function ProjectManagementList() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [status, setStatus] = useState('');
  const [cause, setCause] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [session, setSession] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);  // Gestion de l'ouverture du dialog
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/projets`);
        setProjects(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
      }
    };

    const fetchSession = () => {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');

      if (userId && userRole) {
        setSession({
          user: { id: userId, role: userRole },
        });
      }
    };

    fetchProjects();
    fetchSession();
  }, []);

  useEffect(() => {
    if (selectedProject && selectedProject.statut === 'pending') {
      fetchAvailableTeams();
    }
  }, [selectedProject]);

  const handleProjectClick = async (id) => {
    try {
      const response = await axios.get(`${backendURL}/api/projets/${id}`);
      setSelectedProject(response.data);
      setStatus(response.data.statut || '');
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du projet :', error);
    }
  };

  const handleBackToList = () => {
    setSelectedProject(null);
    setCause('');
  };

  const handleRejectProject = async () => {
    if (!cause.trim()) {
      alert('Veuillez indiquer la cause du refus.');
      return;
    }

    try {
      await axios.put(`${backendURL}/api/projets/${selectedProject.id_projet}`, {
        statut: 'rejected',
        raison_refus: cause,
      });
      setStatus('rejected');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Erreur lors du refus du projet :", error);
    }
  };
  const handleAcceptProject = async () => {
    if (!selectedTeam) {
      alert('Veuillez sélectionner une équipe pour ce projet.');
      return;
    }
  
    try {
      const team = availableTeams.find((team) => team.id_equipe === selectedTeam);
      const chefDeProjetId = team ? team.id_chef_de_projet : null;
     
      await axios.put(`${backendURL}/api/projets/${selectedProject.id_projet}`, {
        statut: 'accepted',
        id_chef_projet: chefDeProjetId,  // On met à jour uniquement le chef de projet
      });
  
      setStatus('accepted');
      setOpenSnackbar(true);
      setOpenDialog(false);  // Fermer le dialog après l'acceptation
    } catch (error) {
      console.error("Erreur lors de l'acceptation du projet :", error);
    }
  };
  

  const fetchAvailableTeams = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/equipes/available`);
      setAvailableTeams(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes disponibles :', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in progress':
        return 'info';
      case 'completed':
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ padding: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
      {selectedProject ? (
        <Box sx={{width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: 2, }}>
          <Button onClick={handleBackToList} sx={{ marginBottom: 2 }} variant="contained">
            Retour à la liste
          </Button>

          <Typography variant="h5" gutterBottom>Détails du projet</Typography>
          <Box sx={{ paddingRight: 2 }}>
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
                <Typography sx={{ marginLeft: 1 }}>
                  <a
                    href={`${backendURL}/${selectedProject.document_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Télécharger le document
                  </a>
                </Typography>
              </Box>
            )}

            {session?.user?.role === 'admin' && (
              <Box sx={{ marginTop: 2 }}>
                <Button onClick={handleDialogOpen} variant="contained" color="success">
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
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>Liste des projets</Typography>
          <List sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {projects.map((project) => (
              <ListItem
                key={project.id_projet}
                button
                onClick={() => handleProjectClick(project.id_projet)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={project.nom}
                  secondary={project.description}
                />
                <Chip label={project.statut} color={getStatusColor(project.statut)} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Action réussie !
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Sélectionner une équipe</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="team-select-label">Sélectionner une équipe</InputLabel>
            <Select
              labelId="team-select-label"
              id="team-select"
              value={selectedTeam || ''}
              label="Sélectionner une équipe"
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {availableTeams.length > 0 ? (
                availableTeams.map((team) => (
                  <MenuItem key={team.id_equipe} value={team.id_equipe}>
                    {team.nom_equipe}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">
                  <em>Aucune équipe disponible</em>
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleAcceptProject} color="primary">
            Accepter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
