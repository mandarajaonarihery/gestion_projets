import React, { useState } from 'react';
import { Button, TextField, Grid, Box, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import axios from 'axios'; // Importation de axios

export default function ProjectForm() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);  // État pour gérer le chargement de la soumission

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleDocumentChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!projectName || !projectDescription || !startDate || !endDate) {
      setError('Tous les champs sont requis.');
      return;
    }
  
    // Récupérer l'ID de l'utilisateur depuis localStorage
    const userId = localStorage.getItem('userId');  // L'ID de l'utilisateur est déjà stocké ici
    if (!userId) {
      setError('Utilisateur non authentifié.');
      return;
    }
  
    // Création de l'objet FormData
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('projectDescription', projectDescription);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('clientId', userId); // Ajouter l'ID de l'utilisateur (client)
  
    if (image) formData.append('image', image);
    if (document) formData.append('document', document);
  
    // Envoi des données via axios
    setLoading(true); // Affichage de l'icône de chargement
    try {
      const response = await axios.post(`${backendURL}/api/projets`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Indique que des fichiers sont envoyés
        },
      });
      
      

      setOpenSnackbar(true);
      console.log('Réponse du serveur:', response.data);
  
      // Réinitialisation des champs après envoi
      setProjectName('');
      setProjectDescription('');
      setStartDate('');
      setEndDate('');
      setImage(null);
      setDocument(null);
      setError('');
    } catch (err) {
      console.error('Erreur lors de l\'envoi des données:', err);
      setError('Erreur lors de l\'envoi du formulaire.');
    } finally {
      setLoading(false);  // Masquer l'icône de chargement après l'envoi
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Commander un Nouveau Projet
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nom du projet"
              variant="outlined"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Date de début"
              variant="outlined"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Date de fin"
              variant="outlined"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Champ pour image */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                textTransform: 'none',
                backgroundColor: '#00796b',
                '&:hover': { backgroundColor: '#004d40' },
                mb: 2, // Ajouter une marge en bas
              }}
            >
              Télécharger une image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {image && <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>Image sélectionnée: {image.name}</Typography>}
          </Grid>

          {/* Champ pour document */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                textTransform: 'none',
                backgroundColor: '#0288d1',
                '&:hover': { backgroundColor: '#01579b' },
                mb: 2, // Ajouter une marge en bas
              }}
            >
              Télécharger un document
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={handleDocumentChange}
              />
            </Button>
            {document && <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>Document sélectionné: {document.name}</Typography>}
          </Grid>

          {/* Bouton Soumettre */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'none',
                mt: 2,
                display: 'block', // Pour faire en sorte que le bouton occupe une seule ligne
              }}
              fullWidth
              disabled={loading} // Désactiver le bouton pendant le chargement
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Soumettre'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Projet créé avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
}
