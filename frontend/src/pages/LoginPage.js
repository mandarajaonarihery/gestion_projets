import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import loginAnimation from "../animations/login.json"; 
import signupAnimation from "../animations/signup.json"; 

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !fullName)) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const endpoint = isSignUp ? "/api/signup" : "/api/login";
      const payload = isSignUp
        ? { email, mot_de_passe: password, fullName, role: "client" }
        : { email, mot_de_passe: password };

      const response = await axios.post(`${backendURL}${endpoint}`, payload);

      const { role, id_utilisateur } = response.data;

      localStorage.setItem("userId", id_utilisateur);
      localStorage.setItem("userRole", role);

      if (role === "admin") {
        navigate("/admin/");
      } else if (role === "client") {
        navigate("/client");
      }
      else if (role === "chef_projet") {
        navigate("/chef");
      } 
      else if (role === "membre") {
        navigate("/membres");
      } 
      else {
        setError("Rôle inconnu. Contactez l'administrateur.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Erreur lors de la connexion.");
      } else {
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      }
    }
  };

  return (
    <Box
  sx={{
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  }}
>
  {/* Section animation */}
  <motion.div
    initial={{ x: 0 }}
    animate={{ x: isSignUp ? "100%" : "0%" }} // Déplacement dynamique
    transition={{ duration: 0.8 }}
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      position: "relative",
      padding: "2rem",
    }}
  >
    <Box
      sx={{
        width: { xs: "100%", sm: "90%", md: "80%" },
        height: { xs: "100%", sm: "90%", md: "80%" },
        maxWidth: "600px",
        maxHeight: "600px",
      }}
    >
      <Lottie animationData={isSignUp ? signupAnimation : loginAnimation} loop />
    </Box>
    <Typography
      variant="h3"
      sx={{
        zIndex: 1,
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff",
        padding: 2,
        position: "absolute",
        bottom: "20px",
      }}
    >
      {isSignUp ? "Rejoignez-nous dès aujourd'hui !" : "Bon retour !"}
    </Typography>
  </motion.div>

  {/* Section formulaire */}
  <motion.div
    initial={{ x: 0 }}
    animate={{ x: isSignUp ? "-100%" : "0%" }} // Déplacement opposé
    transition={{ duration: 0.8 }}
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      padding: "2rem",
    }}
  >
    <Box
      sx={{
        width: "400px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        padding: "2rem",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
      >
        {isSignUp ? "Créer un compte" : "Connexion"}
      </Typography>

      {/* Champs du formulaire */}
      {isSignUp && (
        <TextField
          fullWidth
          label="Nom complet"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
      )}
      <TextField
        fullWidth
        label="Adresse email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ py: 1.5, borderRadius: "5px", fontSize: "1rem" }}
        onClick={handleSubmit}
      >
        {isSignUp ? "S'inscrire" : "Se connecter"}
      </Button>

      {error && (
        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
            color: "red",
            fontWeight: "bold",
          }}
        >
          {error}
        </Typography>
      )}

      {/* Texte de bas de formulaire */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          textAlign: "center",
          color: "#6a6a6a",
        }}
      >
        {isSignUp
          ? "Vous avez déjà un compte ?"
          : "Vous n'avez pas encore de compte ?"}{" "}
        <span
          style={{
            color: "#2575fc",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Connexion" : "Inscription"}
        </span>
      </Typography>
    </Box>
  </motion.div>
</Box>

  );
};

export default LoginPage;
