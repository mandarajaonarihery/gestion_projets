import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TablePagination,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function TeamCRUD() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nom_equipe: '',
    description: '',
    id_chef_de_projet: '',
  });
  const [chefs, setChefs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    fetchTeams();
    fetchChefs();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/equipes`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des équipes :', error);
      setLoading(false);
    }
  };

  const fetchChefs = async () => {
    try {
      const response = await axios.get(`${backendURL}/chefs`);  // Assuming there's an endpoint for fetching chefs
      setChefs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des chefs :', error);
    }
  };

  const handleSave = async () => {
    if (!formData.nom_equipe || !formData.id_chef_de_projet) {
      alert('Tous les champs sont requis !');
      return;
    }

    try {
      if (editingRow) {
        await axios.put(`${backendURL}/api/equipes/${editingRow.id_equipe}`, formData);
        setData((prevData) =>
          prevData.map((row) =>
            row.id_equipe === editingRow.id_equipe ? { ...formData, id_equipe: editingRow.id_equipe } : row
          )
        );
      } else {
        const response = await axios.post(`${backendURL}/api/equipes`, formData);
        setData((prevData) => [...prevData, response.data]);
      }
  
      setOpenDialog(false);
      setEditingRow(null);
      setFormData({ nom_equipe: '', description: '', id_chef_de_projet: '' });
    }catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'équipe :', error);
        if (error.response) {
          // Affichez toute la réponse du serveur pour mieux comprendre l'erreur
          console.error('Détails de l\'erreur serveur:', error.response);
          alert(`Erreur serveur: ${error.response.data.message || 'Une erreur est survenue'}`);
        } else if (error.request) {
          console.error('Pas de réponse du serveur:', error.request);
          alert('Aucune réponse du serveur, vérifiez la connexion.');
        } else {
          console.error('Erreur inconnue:', error.message);
          alert('Une erreur inconnue est survenue.');
        }
      }
      
      
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      try {
        await axios.delete(`${backendURL}/equipes/${id}`);
        setData((prevData) => prevData.filter((row) => row.id_equipe !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'équipe :', error);
      }
    }
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setFormData({
      nom_equipe: row.nom_equipe,
      description: row.description,
      id_chef_de_projet: row.id_chef_de_projet,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setFormData({ nom_equipe: '', description: '', id_chef_de_projet: '' });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const availableChefs = chefs.filter(
    (chef) => !data.some((team) => team.id_chef_de_projet === chef.id)
  );

  return (
    <Box sx={{ p: 2, maxWidth: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          Liste des équipes
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditingRow(null);
              setFormData({ nom_equipe: '', description: '', id_chef_de_projet: '' });
              setOpenDialog(true);
            }}
          >
            Ajouter une équipe
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom de l'équipe</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Chef de projet</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucune équipe trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.id_equipe}>
                    <TableCell>{row.id_equipe}</TableCell>
                    <TableCell>{row.nom_equipe}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.id_chef_de_projet}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(row.id_equipe)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(row)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingRow ? 'Modifier une équipe' : 'Ajouter une équipe'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom de l'équipe"
            fullWidth
            value={formData.nom_equipe || ''}
            onChange={(e) => setFormData({ ...formData, nom_equipe: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
  <InputLabel id="chef-select-label">Chef de projet</InputLabel>
  <Select
    labelId="chef-select-label"
    id="chef-select"
    value={formData.id_chef_de_projet || ''}
    label="Chef de projet"
    onChange={(e) => {
      console.log('Chef sélectionné:', e.target.value);
      setFormData({ ...formData, id_chef_de_projet: e.target.value });
    }}
  >
    {availableChefs.map((chef) => (
      <MenuItem key={chef.id_utilisateur} value={chef.id_utilisateur}>
        {chef.nom}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSave} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TeamCRUD;
