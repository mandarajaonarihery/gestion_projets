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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function DataTableAPI({ title }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({ nom: '', email: '', mot_de_passe: '', role: '' });
  const staticRoles = ['admin', 'chef_projet', 'client', 'membre'];
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success | error
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, searchTerm, selectedRole]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendURL}/users`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = data;

    // Filtrer par rôle
    if (selectedRole) {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    // Filtrer par recherche
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSave = async () => {
    if (!formData.nom || !formData.email || !formData.mot_de_passe) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      if (editingRow && editingRow.id_utilisateur) {
        // Modification d'un utilisateur existant
        await axios.put(`${backendURL}/users/${editingRow.id_utilisateur}`, formData);

        setData((prevData) =>
          prevData.map((row) => (row.id_utilisateur === editingRow.id_utilisateur ? { ...formData, id_utilisateur: editingRow.id_utilisateur } : row))

        );
        showSnackbar('Utilisateur modifié avec succès.', 'success');
      } else {
        // Ajout d'un nouvel utilisateur
        const response = await axios.post(`${backendURL}/user`, formData);
        setData((prevData) => [...prevData, response.data]);
        showSnackbar('Utilisateur ajouté avec succès.', 'success');
      }

      setOpenDialog(false);
      setEditingRow(null);
      setFormData({ nom: '', email: '', mot_de_passe: '', role: '' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`${backendURL}/users/${id}`);
        setData((prevData) => prevData.filter((row) => row.id_utilisateur !== id));
        showSnackbar('Utilisateur supprimé avec succès.', 'success');
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
      }
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleEdit = (row) => {
    setEditingRow(row);
    setFormData({
      nom: row.nom,
      email: row.email,
       // Ne pas pré-remplir le mot de passe lors de l'édition
      role: row.role,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setFormData({ nom: '', email: '', mot_de_passe: '', role: '' });
  };

  return (
    <Box sx={{ p: 2, maxWidth: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' ,maxHeight: '70vh',}}>
      <Box sx={{ width: '100%', maxWidth: '1200px', margin: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          Liste des utilisateurs - {title}
        </Typography>
        <Box sx={{ mb: 2 }}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditingRow({ nom: '', email: '', role: '', mot_de_passe: '' });
              setOpenDialog(true);
            }}
          >
            Ajouter un utilisateur
          </Button>
          </Box>
        {/* Section de recherche et filtrage par rôle */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Recherche"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            displayEmpty
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Tous les rôles</MenuItem>
            {staticRoles.map((role, index) => (
              <MenuItem key={index} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          
        </Box>

        {/* Tableau des utilisateurs */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Mot de passe</TableCell>
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
                  <TableCell colSpan={6} align="center">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.id_utilisateur}>
                    <TableCell>{row.id_utilisateur}</TableCell>
                    <TableCell>{row.nom}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.mot_de_passe}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(row.id_utilisateur)}>
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[3, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={4000} // Durée d'affichage en millisecondes
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity={snackbarSeverity}
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>


      {/* Dialog d'ajout ou modification d'utilisateur */}
      {/* Dialog d'ajout ou modification d'utilisateur */}
<Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogTitle>
    {editingRow?.id_utilisateur ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}
  </DialogTitle>
  <DialogContent>
    <TextField
      label="Nom"
      fullWidth
      value={formData.nom || ''}
      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      label="Email"
      fullWidth
      value={formData.email || ''}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      sx={{ mb: 2 }}
    />
    {/* Afficher le champ Mot de passe seulement si on est en mode ajout */}
    {!editingRow?.id_utilisateur && (
      <TextField
        label="Mot de passe"
        type="password"
        fullWidth
        value={formData.mot_de_passe || ''}
        onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
        sx={{ mb: 2 }}
      />
    )}
    <Select
      value={formData.role || ''}
      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      displayEmpty
      fullWidth
      sx={{ mb: 2 }}
    >
      <MenuItem value="">Sélectionner un rôle</MenuItem>
      {staticRoles.map((role, index) => (
        <MenuItem key={index} value={role}>
          {role}
        </MenuItem>
      ))}
    </Select>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseDialog}>Annuler</Button>
    <Button onClick={handleSave} variant="contained" color="primary">
      Sauvegarder
    </Button>
  </DialogActions>
</Dialog>

    </Box>
    
  );
}

export default DataTableAPI;
