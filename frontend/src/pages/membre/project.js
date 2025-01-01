import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  Typography,
  CircularProgress,
  Paper,
  Box,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { Container, Grid,     Chip } from '@mui/material';

export default function MemberProjects() {
  const [projects, setProjects] = useState([]); // Liste des projets
  const [filteredProjects, setFilteredProjects] = useState([]); // Projets filtrés pour la recherche
  const [loading, setLoading] = useState(true); // Chargement initial
  const [selectedProject, setSelectedProject] = useState(null); // Projet sélectionné
  const userId = localStorage.getItem("userId"); // ID du membre connecté
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  // Charger les projets assignés au membre
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/projects/member/${userId}`);
        setProjects(response.data);
        setFilteredProjects(response.data); // Initialiser les projets filtrés
      } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  // Récupérer les détails d'un projet spécifique
  const handleProjectClick = async (projectId) => {
    try {
      const response = await axios.get(`${backendURL}/api/projects/${projectId}/details`);
      setSelectedProject(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des détails du projet :", error);
    }
  };

  // Retourner à la liste des projets
  const goBackToList = () => {
    setSelectedProject(null);
  };

  // Fonction pour colorier le statut
  const getStatusColor = (status) => {
    switch (status) {
      case "in_progress":
        return "orange";
      case "completed":
        return "green";
      case "todo":
        return "gray";
      default:
        return "black";
    }
  };

  // Marquer une tâche comme terminée
  const markTaskAsCompleted = async (taskId) => {
    try {
      await axios.patch(`${backendURL}/api/tasks/${taskId}`, { statut: "completed" });
      alert("Tâche marquée comme terminée !");
      handleProjectClick(selectedProject.id_projet); // Recharger les détails du projet
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  // Filtrer les projets par recherche
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    const filtered = projects.filter((project) =>
      project.nom.toLowerCase().includes(searchValue)
    );
    setFilteredProjects(filtered);
  };

  // Chargement initial
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }


  return (
    <Container style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      {/* Liste des projets */}
      {!selectedProject ? (
        <Paper style={{ padding: "20px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Liste des projets
          </Typography>
          
          {/* Recherche */}
          <TextField
            placeholder="Rechercher un projet"
            fullWidth
            margin="normal"
            onChange={handleSearch}
            style={{ marginBottom: "20px" }}
          />
  
          <List style={{ width: '100%' }}>
            {filteredProjects.map((project) => (
              <ListItem
                key={project.id_projet}
                button
                onClick={() => handleProjectClick(project.id_projet)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                  padding: "15px",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                <Box>
                  <Typography variant="h6">{project.nom}</Typography>
                  <Typography variant="body2">{project.description}</Typography>
                </Box>
                <Chip label={project.statut} color={getStatusColor(project.statut)} />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        // Détails d'un projet
        <Paper style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
          <Typography variant="h4" align="center" gutterBottom>
            {selectedProject.nom}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectedProject.description}
          </Typography>
          <Typography variant="body2" style={{ fontSize: "1.1rem" }}>
            <strong>Chef de projet :</strong> {selectedProject.chef_de_projet}
          </Typography>
  
          {/* Progression */}
          <Box marginBottom="20px">
            <Typography variant="h6">Progression globale :</Typography>
            <div style={{ background: "#eee", borderRadius: "5px", height: "10px", width: "100%" }}>
              <div
                style={{
                  width: `${Math.round(
                    (selectedProject.taches.filter((task) => task.statut === "completed").length / selectedProject.taches.length) * 100
                  )}%`,
                  background: "green",
                  height: "100%",
                  borderRadius: "5px",
                }}
              ></div>
            </div>
          </Box>
  
          <Typography variant="h6" gutterBottom>
            Membres de l'équipe :
          </Typography>
          <Grid container spacing={2}>
            {selectedProject.membres_equipe.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Paper style={{ padding: '10px', textAlign: 'center' }}>
                  <Typography variant="body2">{member.nom}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
  
          <Typography variant="h6" gutterBottom>
            Tâches :
          </Typography>
          {["todo", "in_progress", "completed"].map((status) => (
            <Box key={status} marginBottom="10px">
              <Typography variant="subtitle1" style={{ color: getStatusColor(status), fontWeight: "bold" }}>
                {status === "todo" ? "À faire" : status === "in_progress" ? "En cours" : "Terminées"}
              </Typography>
              <ul>
                {selectedProject.taches
                  .filter((task) => task.statut === status)
                  .map((task) => (
                    <li key={task.id_tache}>
                      {task.nom}
                      {task.assigne_au_membre && status !== "completed" && (
                        <Button
                          size="small"
                          onClick={() => markTaskAsCompleted(task.id_tache)}
                          style={{ marginLeft: "10px", backgroundColor: "#4caf50", color: "white" }}
                        >
                          Terminer
                        </Button>
                      )}
                    </li>
                  ))}
              </ul>
            </Box>
          ))}
  
          <Typography variant="h6" gutterBottom>
            Documents liés :
          </Typography>
          <ul>
            {selectedProject.image_path && (
              <li>
                
                <a href={selectedProject.image_path} target="_blank" rel="noopener noreferrer">Voir l'image du projet</a>
              </li>
            )}
            {selectedProject.document_path && (
              <li>
                <a href={selectedProject.document_path} target="_blank" rel="noopener noreferrer">Voir le document du projet</a>
              </li>
            )}
          </ul>
  
          <Button
            onClick={goBackToList}
            variant="contained"
            style={{ marginTop: "20px" }}
          >
            Retour à la liste
          </Button>
        </Paper>
      )}
    </Container>
  );
  
};  
