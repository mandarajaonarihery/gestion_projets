import React, { useState, useEffect } from 'react';
import {
    TextField,
    Card,
    CardContent,
    Button,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Badge,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const Projets = () => {
    const userId = localStorage.getItem('userId');
    const chefId = userId;
    const backendURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const [projets, setProjets] = useState([]);
    const [projetDetails, setProjetDetails] = useState(null);
    const [tache, setTache] = useState({
        nom: '',
        description: '',
        date_debut: '',
        date_fin: '',
        membres: [],
    });
    const [membresEquipe, setMembresEquipe] = useState([]);
    const [openDialog, setOpenDialog] = useState(false); // État pour ouvrir/fermer le Dialog
    const [activeTab, setActiveTab] = useState(0); // Gère l'onglet actif
    const [taches, setTaches] = useState([]); // Liste des tâches du projet
    const theme = useTheme();
    
    useEffect(() => {
        const fetchProjets = async () => {
            try {
                const response = await axios.get(`${backendURL}/api/projetschef/${chefId}`);
                setProjets(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des projets:', error);
            }
        };

        const fetchMembresEquipe = async () => {
            try {
                const equipeResponse = await axios.get(`${backendURL}/chefs/${chefId}/equipe`);
                const equipeId = equipeResponse.data.id_equipe;
                const response = await axios.get(`${backendURL}/equipes/${equipeId}/membres`);
                setMembresEquipe(response.data.dansEquipe);
            } catch (error) {
                console.error('Erreur lors du chargement des membres de l\'équipe:', error);
            }
        };

        fetchProjets();
        fetchMembresEquipe();
    }, [chefId]);


    
    const handleTacheChange = (e) => {
        const { name, value } = e.target;
        setTache((prevTache) => ({
            ...prevTache,
            [name]: value,
        }));
    };

    const handleMembresChange = (e) => {
        setTache((prevTache) => ({
            ...prevTache,
            membres: e.target.value,
        }));
    };
    const mina=0;
    const maxa=0;
    const handleCreateTache = async () => {
        try {
            // Vérifiez si la liste des membres est un tableau et non vide
            if (!Array.isArray(tache.membres) || tache.membres.length === 0) {
                console.error('Veuillez sélectionner au moins un membre.');
                return;
            }
    
            // Envoyer la tâche avec tous les membres au backend
            const response = await axios.post(`${backendURL}/api/tache`, {
                ...tache,
                id_projet: projetDetails.id_projet, // Associe le projet
            });
    
            console.log('Tâche créée:', response.data);
            window.location.reload();

            // Réinitialise le formulaire et ferme la boîte de dialogue
            setTache({ nom: '', description: '', date_debut: '', date_fin: '', membres: [] });
            setOpenDialog(false);
    
            // Met à jour la liste des tâches
            setTaches([...taches, response.data]);
    
            // Mettre à jour le statut du projet dans le frontend si nécessaire
            const updatedProjetResponse = await axios.get(`${backendURL}/api/projets/${projetDetails.id_projet}`);
            setProjetDetails(updatedProjetResponse.data);
             mina = projetDetails ? projetDetails.date_debut : null;
             maxa = projetDetails ? projetDetails.date_fin : null;
            alert( mina,maxa)
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
        }
    };
    

    const fetchTaches = async () => {
  try {
    const response = await axios.get('/api/taches');
    setTaches(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches", error);
  }
};

useEffect(() => {
  fetchTaches(); // Charger les tâches au montage du composant
}, []);

    const handleUpdateTache = async () => {
        try {
          // Vérifier que les champs requis sont remplis
          if (!tache.nom || !tache.statut) {
            console.error('Les champs "nom" et "statut" sont obligatoires.');
            return;
          }
      
          // Extraire les IDs des membres
          const membresIds = tache.membres.map((membre) => parseInt(membre, 10));
      
          // Requête PUT vers le backend
          const response = await axios.put(`${backendURL}/api/tache/${tache.id_tache}`, {
            nom: tache.nom,
            description: tache.description || null,
            date_debut: tache.date_debut || null,
            date_fin: tache.date_fin || null,
            statut: tache.statut,
            membres: membresIds, // Tableau des IDs des membres
          });
      
          console.log('Tâche mise à jour:', response.data);
      
          // Mettre à jour l'état local des tâches
          setTaches(taches.map((t) => (t.id_tache === tache.id_tache ? response.data : t)));
      
          // Réinitialiser les champs et fermer le modal
          setTache({ nom: '', description: '', date_debut: '', date_fin: '', statut: '', membres: [] });
          setOpenDialog(false);
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la tâche:', error);
        }
      };
      
    
    // Fonction pour ouvrir le Dialog en mode édition
    const handleEditTache = (tacheToEdit) => {
        setTache({
          id_tache: tacheToEdit.id_tache,
          nom: tacheToEdit.nom,
          description: tacheToEdit.description,
          date_debut: tacheToEdit.date_debut,
          date_fin: tacheToEdit.date_fin,
          statut: tacheToEdit.statut,  // Assurez-vous que le statut est inclus
          id_utilisateur: tacheToEdit.id_utilisateur, // Assurez-vous que l'id_utilisateur est inclus si nécessaire
          membres: Array.isArray(tacheToEdit.membres) ? tacheToEdit.membres : [], 
        });
        setOpenDialog(true); // Ouvre le dialog pour modifier la tâche
      };
      
      const handleVoirDetails = async (id_projet) => {
        try {
            const response = await axios.get(`${backendURL}/api/projet/${id_projet}`);
            
            console.log(response.data);  // Vérifiez que vous obtenez bien les bonnes données
            setProjetDetails(response.data);
            setTaches(response.data.taches || []); // Charger les tâches associées au projet
        } catch (error) {
            console.error('Erreur lors de la récupération des détails du projet:', error);
        }
    };
    
    const handleRetourListe = () => {
        setProjetDetails(null);
        setActiveTab(0); // Retour à l'onglet "Détails du projet"
    };

    const handleDownloadDocument = (documentUrl) => {
        const link = document.createElement('a');
        link.href = documentUrl;
        link.download = documentUrl.split('/').pop();
        link.click();
    };
    const handleDeleteTache = async (id_tache) => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?');
        if (!confirmDelete) return;
      
        try {
          await axios.delete(`${backendURL}/api/tache/${id_tache}`);
          setTaches(taches.filter((t) => t.id_tache !== id_tache)); // Met à jour la liste après suppression
          console.log('Tâche supprimée');
        } catch (error) {
          console.error('Erreur lors de la suppression de la tâche:', error);
        }
      };
      
   // Fonction pour formater la date au format 'YYYY-MM-DD'
   const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString); // Convertit la chaîne en objet Date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois avec zéro en tête
    const day = String(date.getDate()).padStart(2, '0'); // Jour avec zéro en tête
    return `${year}-${month}-${day}`; // Format 'YYYY-MM-DD'
  };
  const handleTerminerProjet = async (idProjet) => {
    try {
        // Appel API pour marquer le projet comme terminé
        await axios.put(`${backendURL}/api/projets/${idProjet}/completed`);

        // Afficher une confirmation à l'utilisateur
        alert('Le projet a été marqué comme terminé.');

        // Rafraîchir la liste des projets
        const projetsResponse = await axios.get(`${backendURL}/api/projetschef/${chefId}`);
        setProjets(projetsResponse.data);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet :', error);

        // Gérer les erreurs du serveur
        if (error.response?.status === 400) {
            alert(error.response.data.error);
        } else {
            alert('Une erreur s\'est produite. Veuillez réessayer.');
        }
    }
};




      
    const handleChangeTab = (event, newTab) => {
        setActiveTab(newTab);
    };

    return (
        <div>
            {projetDetails && (
                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginBottom: 2 }}
                    onClick={handleRetourListe}
                >
                    Retour à la liste des projets
                </Button>
            )}

            {!projetDetails && (
               <Grid container spacing={2} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
               {projets.map((projet) => {
                   const hasTaches = Array.isArray(projet.taches) && projet.taches.length > 0;
                   const allTachesCompleted =
                       hasTaches && projet.taches.every((tache) => tache.statut === 'completed');
           
                   return (
                       <Grid item key={projet.id_projet}>
                           <Card
                               sx={{
                                   height: '100%',
                                   padding: 2,
                                   borderRadius: 2,
                                   backgroundColor: allTachesCompleted
                                       ? '#4caf50 !important' // Vert pour les projets terminés
                                       : '#ffc107 !important', // Jaune pour les projets en cours
                               }}
                           >
                               <CardContent>
                                   <Typography variant="h6">{projet.nom}</Typography>
                                   <Typography variant="body2">{projet.description}</Typography>
                                   <Typography variant="body2" color="textSecondary">
                                       Statut: {projet.statut}
                                   </Typography>
                                   <Badge color="primary" variant="dot" invisible={!projet.nouveau} />
           
                                   {/* Bouton pour voir les détails du projet */}
                                   <Button
                                       variant="contained"
                                       color="primary"
                                       sx={{ marginTop: 2 }}
                                       onClick={() => handleVoirDetails(projet.id_projet)}
                                   >
                                       Voir le projet
                                   </Button>
           
                                   {/* Vérification pour ne pas afficher le bouton "Terminer le projet" si le statut est "terminé" */}
                                   {allTachesCompleted && projet.statut !== 'in rewiew'&&(
                                       <Button
                                           variant="contained"
                                           color="secondary"
                                           sx={{ marginTop: 2, marginLeft: 2 }}
                                           onClick={() => handleTerminerProjet(projet.id_projet)}
                                       >
                                           Terminer le projet
                                       </Button>
                                   )}
                               </CardContent>
                           </Card>
                       </Grid>
                   );
               })}
           </Grid>
           
            
            )}

            {projetDetails && (
                <div>
                    <Tabs value={activeTab} onChange={handleChangeTab} centered>
                        <Tab label="Détails du projet" />
                        <Tab label="Tâches" />
                    </Tabs>

                    {activeTab === 0 && (
                        <Card sx={{ marginTop: 2 }}>
                            <CardContent>
                                <Typography variant="h5">{projetDetails.nom}</Typography>
                                <Typography variant="body1">{projetDetails.description}</Typography>
                                   <Typography><strong>Date de début :</strong> {new Date(projetDetails.date_debut).toLocaleDateString()}</Typography>
                                         <Typography><strong>Date de fin :</strong> {new Date(projetDetails.date_fin).toLocaleDateString()}</Typography>
                                 <Typography><strong>Date de début :</strong> {new Date(projetDetails.date_debut).toLocaleDateString()}</Typography>
                                         <Typography><strong>Date de fin :</strong> {new Date(projetDetails.date_fin).toLocaleDateString()}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Statut: {projetDetails.statut}
                                </Typography>

                                {projetDetails.image_path && (
                                    <div>
                                        <Typography variant="h6">Image du projet</Typography>
                                        <img
                                            src={`${backendURL}/${projetDetails.image_path.replace(/\\/g, '/')}`}
                                            alt="Projet"
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                        />
                                    </div>
                                )}

                                {projetDetails.document_path && (
                                    <div>
                                        <Typography variant="h6">Document du projet</Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleDownloadDocument(projetDetails.document_path)}
                                        >
                                            Télécharger le document
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 1 && (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginBottom: 2 }}
                                onClick={() => setOpenDialog(true)}
                            >
                                Ajouter une tâche
                            </Button>

                            <Grid container spacing={2}>
                                {taches.map((t) => (
                                    <Grid item key={t.id_tache}>
                                        <Card>
                                            <CardContent>
                                            <Typography variant="h6">{t.nom}</Typography>
                                           
                    <Typography variant="body2">{t.description}</Typography>
                    <Typography variant="body2">{t.statut}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Dates : {new Date(t.date_debut).toLocaleDateString()} - {new Date(t.date_fin).toLocaleDateString()}
                        </Typography>
                    {/* Affichage des membres */}
                    <Typography variant="body2" color="textSecondary">
                        Membres : {t.membres && t.membres.length > 0 ? t.membres.map(membreId => {
                            const membre = membresEquipe.find(m => m.id_utilisateur === membreId);
                            return membre ? membre.nom : '';
                        }).join(', ') : 'Aucun membre'}
                    </Typography>

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditTache(t)}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleDeleteTache(t.id_tache)}
                    >
                        Supprimer
                    </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    )}
                </div>
            )}

<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>{tache.id_tache ? 'Modifier' : 'Ajouter'} une tâche</DialogTitle>
      <DialogContent>
        <TextField
          label="Nom de la tâche"
          name="nom"
          value={tache.nom}
          onChange={handleTacheChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Description"
          name="description"
          value={tache.description}
          onChange={handleTacheChange}
          fullWidth
          multiline
          rows={4}
          sx={{ marginBottom: 2 }}
        />
         
         <TextField
        label="Date de début"
        type="date"
        name="date_debut"
        value={tache.date_debut}
        onChange={handleTacheChange}
        fullWidth
        InputLabelProps={{
            shrink: true,
        }}
   
    />
 <TextField
        label="Date de fin"
        type="date"
        name="date_fin"
        value={tache.date_fin}
        onChange={handleTacheChange}
        fullWidth
        InputLabelProps={{
            shrink: true,
        }}
        inputProps={{
            min: mina,  // Vérifie que projetDetails est défini
    max: maxa,  // Vérifie que projetDetails est défini
        }}
    />


        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Membres</InputLabel>
          <Select
            multiple
            name="membres"
            value={tache.membres}
            onChange={handleMembresChange}
            label="Membres"
          >
            {membresEquipe.map((membre) => (
              <MenuItem key={membre.id_utilisateur} value={membre.id_utilisateur}>
                {membre.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="secondary">
          Annuler
        </Button>
        <Button
          onClick={tache.id_tache ? handleUpdateTache : handleCreateTache}
          color="primary"
        >
          {tache.id_tache ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
        </div>
        
    );
    
};

export default Projets;
