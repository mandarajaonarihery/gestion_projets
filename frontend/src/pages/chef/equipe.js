import React, { useEffect, useState } from 'react';
import { Tabs, Tab, List, ListItem, ListItemText, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';

function GestionEquipe() {
  const [currentTab, setCurrentTab] = useState(0);
  const [membresDisponibles, setMembresDisponibles] = useState([]);
  const [membresDansEquipe, setMembresDansEquipe] = useState([]);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMembre, setSelectedMembre] = useState(null);
  const idChef = localStorage.getItem('userId');
  const [idEquipe, setIdEquipe] = useState(null);
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchEquipe = async () => {
      if (idChef) {
        try {
          // Appel API pour récupérer l'ID de l'équipe pour le chef de projet
          const equipeResponse = await axios.get(`${backendURL}/chefs/${idChef}/equipe`);
          const equipeId = equipeResponse.data.id_equipe;
  
          if (equipeId) {
            setIdEquipe(equipeId);
  
            // Appel pour récupérer les membres de l'équipe
            const response = await axios.get(`${backendURL}/equipes/${equipeId}/membres`);
            setMembresDisponibles(response.data.disponibles || []);
            setMembresDansEquipe(response.data.dansEquipe || []);
          } else {
            console.error('Équipe introuvable pour ce chef');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données', error);
        }
      } else {
        console.error('ID du chef introuvable dans le localStorage');
      }
    };
    fetchEquipe();
  }, [idChef]);
  

  const handleOpenDialog = (membre) => {
    setSelectedMembre(membre);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMembre(null);
  };

  const ajouterMembre = async (idUtilisateur) => {
    if (!idEquipe) {
      console.error('ID de l\'équipe non défini');
      return;
    }

    try {
      await axios.post(`${backendURL}/equipes/${idEquipe}/membres`, { id_utilisateur: idUtilisateur });
      setMembresDansEquipe((prev) => [...prev, selectedMembre]);
      setMembresDisponibles((prev) => prev.filter((m) => m.id_utilisateur !== idUtilisateur));
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre', error);
    }
  };

  // Définition de la fonction retirerMembre
  const retirerMembre = async (idUtilisateur) => {
    if (!idEquipe) {
      console.error('ID de l\'équipe non défini');
      return;
    }

    try {
      await axios.delete(`${backendURL}/equipes/${idEquipe}/membres/${idUtilisateur}`);
      setMembresDisponibles((prev) => [...prev, membresDansEquipe.find((m) => m.id_utilisateur === idUtilisateur)]);
      setMembresDansEquipe((prev) => prev.filter((m) => m.id_utilisateur !== idUtilisateur));
    } catch (error) {
      console.error('Erreur lors du retrait du membre', error);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={currentTab} onChange={(e, value) => setCurrentTab(value)} centered>
        <Tab label="Liste des membres disponibles" />
        <Tab label="Membres dans le groupe" />
      </Tabs>

      {currentTab === 0 && (
        <List>
          {membresDisponibles.map((membre) => (
            <ListItem key={membre.id_utilisateur}>
              <ListItemText primary={membre.nom} secondary={membre.email} />
              <Button
                variant="contained"
                onClick={() => handleOpenDialog(membre)}
              >
                Ajouter
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {currentTab === 1 && (
        <List>
          {membresDansEquipe.map((membre) => (
            <ListItem key={membre.id_utilisateur}>
              <ListItemText primary={membre.nom} secondary={membre.email} />
              <Button
                variant="outlined"
                color="error"
                onClick={() => retirerMembre(membre.id_utilisateur)}
              >
                Retirer
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter un membre à l'équipe</DialogTitle>
        <DialogContent>
          {selectedMembre && (
            <>
              <TextField
                label="Nom"
                value={selectedMembre.nom}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Email"
                value={selectedMembre.email}
                fullWidth
                margin="normal"
                disabled
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button
            onClick={() => ajouterMembre(selectedMembre.id_utilisateur)}
            color="primary"
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default GestionEquipe;
