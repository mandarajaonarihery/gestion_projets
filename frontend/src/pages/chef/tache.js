import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import { Search, ArrowDownward, ArrowUpward } from "@mui/icons-material";

const TachesSegment = () => {
  const [projets, setProjets] = useState([]); // Projets liés au chef
  const [selectedProjet, setSelectedProjet] = useState(null); // Projet sélectionné
  const [taches, setTaches] = useState([]); // Tâches du projet sélectionné
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [sortDirection, setSortDirection] = useState(null); // Direction du tri
  const [sortField, setSortField] = useState(null); // Champ du tri
  const userId = localStorage.getItem("userId");
  const chefId = userId;
  const backendURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  // Étape 1 : Charger les projets liés au chef
  useEffect(() => {
    if (!chefId) return;

    const fetchProjets = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/projetschef/${chefId}`
        );
        setProjets(response.data);
        // Par défaut, sélectionner le premier projet
        if (response.data.length > 0) {
          setSelectedProjet(response.data[0].id_projet);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
      }
    };

    fetchProjets();
  }, [chefId]);

  // Étape 2 : Charger les tâches du projet sélectionné
  useEffect(() => {
    if (!selectedProjet) return;

    const fetchTaches = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/projets/${selectedProjet}/taches`
        );
        setTaches(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des tâches :", error);
      }
    };

    fetchTaches();
  }, [selectedProjet]);

  // Filtrer les tâches en fonction du terme de recherche
  const filteredTaches = taches.filter((tache) =>
    tache.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tache.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tache.membres
      .map((membre) => membre.nom_membre.toLowerCase())
      .join(", ")
      .includes(searchTerm.toLowerCase())
  );

  // Fonction de tri
  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(direction);
    setSortField(field);

    const sortedTaches = [...filteredTaches].sort((a, b) => {
      if (direction === "asc") {
        return a[field] < b[field] ? -1 : 1;
      } else {
        return a[field] > b[field] ? -1 : 1;
      }
    });
    setTaches(sortedTaches);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tâches par Projet</h2>

      {/* Dropdown pour sélectionner un projet */}
      <div className="mb-4">
        <label htmlFor="projet-select" className="mr-2">
          Sélectionnez un projet :
        </label>
        <Select
          id="projet-select"
          value={selectedProjet || ""}
          onChange={(e) => setSelectedProjet(e.target.value)}
        >
          {projets.map((projet) => (
            <MenuItem key={projet.id_projet} value={projet.id_projet}>
              {projet.nom}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="mb-4 flex items-center">
       
        <TextField
          label="Rechercher une tâche"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            ),
          }}
        />
      </div>

      {/* Tableau des tâches filtrées avec icônes pour le tri */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Nom
              <IconButton onClick={() => handleSort("nom")}>
                {sortField === "nom" && sortDirection === "asc" ? (
                  <ArrowUpward />
                ) : (
                  <ArrowDownward />
                )}
              </IconButton>
            </TableCell>
            <TableCell>
              Description
              <IconButton onClick={() => handleSort("description")}>
                {sortField === "description" && sortDirection === "asc" ? (
                  <ArrowUpward />
                ) : (
                  <ArrowDownward />
                )}
              </IconButton>
            </TableCell>
            <TableCell>
              Date début
              <IconButton onClick={() => handleSort("date_debut")}>
                {sortField === "date_debut" && sortDirection === "asc" ? (
                  <ArrowUpward />
                ) : (
                  <ArrowDownward />
                )}
              </IconButton>
            </TableCell>
            <TableCell>
              Date fin
              <IconButton onClick={() => handleSort("date_fin")}>
                {sortField === "date_fin" && sortDirection === "asc" ? (
                  <ArrowUpward />
                ) : (
                  <ArrowDownward />
                )}
              </IconButton>
            </TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Membres</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTaches.map((tache) => (
            <TableRow key={tache.id_tache}>
              <TableCell>{tache.nom}</TableCell>
              <TableCell>{tache.description}</TableCell>
              <TableCell>{new Date(tache.date_debut).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(tache.date_fin).toLocaleDateString()}</TableCell>
              <TableCell>{tache.statut}</TableCell>
              <TableCell>{tache.membres.map((membre) => membre.nom_membre).join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TachesSegment;
