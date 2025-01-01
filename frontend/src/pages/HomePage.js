import { Link } from 'react-router-dom';
import {
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  CardActions,
} from '@mui/material';
import { motion } from 'framer-motion';

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Mail';
import InstagramIcon from '@mui/icons-material/Instagram';
import t from '../images/t.png';
import res from '../images/res.png';
import o from '../images/OIP.jpg';
import myLogo from '../images/dev2.png';
function HomePage() {
  const bubbleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i) => ({
      opacity: [0.5, 1, 0.5],
      scale: [0.5, 1, 0.5],
      y: [0, -150, -300],
      x: [0, i * 15, -i * 15],
      transition: {
        duration: 7,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      },
    }),
  };

  const bubbles = Array.from({ length: 15 });

  return (
    <div>
      {/* Section Hero avec bulles */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5%',
          backgroundColor: '#264653',
          overflow: 'hidden',
        }}
      >
        {/* Bulles animées */}
        {bubbles.map((_, i) => (
          <motion.div
            key={i}
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            custom={i}
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#2A9D8F',
              top: '100%',
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Texte de bienvenue */}
        <Box sx={{ flex: 1, color: '#FFE8D6', textAlign: 'left' }}>
  {/* Animation pour le titre */}
  <motion.div
    initial={{ x: '-100vw' }}
    animate={{ x: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  >
    <motion.div
      animate={{
        y: [0, -10, 0], // Mouvement vertical
      }}
      transition={{
        duration: 2, // Durée d'un cycle
        repeat: Infinity, // Répétition infinie
        ease: 'easeInOut', // Mouvement fluide
        delay: 2, // Attendre que l'entrée initiale soit terminée
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 'bold',
          marginBottom: 3,
          textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
          fontSize: '3.5rem',
        }}
      >
        Bonjour et Bienvenue
      </Typography>
    </motion.div>
  </motion.div>

  {/* Animation pour le sous-titre */}
  <motion.div
    initial={{ x: '-100vw' }}
    animate={{ x: 0 }}
    transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
  >
    <motion.div
      animate={{
        opacity: [1, 0.8, 1], // Variation de transparence
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 2, // Démarrer après l'entrée initiale
      }}
    >
      <Typography variant="h6">
        Simplifiez votre workflow et développez vos projets avec efficacité.
      </Typography>
    </motion.div>
  </motion.div>

  {/* Animation pour le bouton */}
  <motion.div
    initial={{ x: '-100vw' }}
    animate={{ x: 0 }}
    transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
  >
    <motion.div
      animate={{
        scale: [1, 1.05, 1], // Effet de pulsation
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 2, // Démarrer après l'entrée initiale
      }}
    >
      <Link to="/login">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2A9D8F',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: 8,
            padding: '15px 30px',
            fontSize: '1.2rem',
            '&:hover': { backgroundColor: '#E76F51' },
            transition: 'background-color 0.3s ease',
          }}
        >
          Get Started
        </Button>
      </Link>
    </motion.div>
  </motion.div>
</Box>


        {/* Image avec animation */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
  <motion.div
    initial={{ y: '-100vh' }}
    animate={{ y: 0 }}
    transition={{ duration: 1.5, ease: 'easeOut' }}
  >
    <motion.img
      src={myLogo}
      alt="Illustration"
      style={{
        maxWidth: '80%',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      }}
      animate={{
        y: [0, 15, 0], // Mouvement vertical (monte de 15px, puis revient)
      }}
      transition={{
        duration: 2, // Durée totale du cycle
        repeat: Infinity, // Répète indéfiniment
        ease: 'easeInOut', // Douceur dans le mouvement
      }}
    />
  </motion.div>
</Box>

      </Box>

      {/* Section À propos et Projets */}
     {/* Section Nos Projets avec images */}
<Box
  sx={{
    padding: '5%',
    backgroundColor: '#F4F4F4',
    textAlign: 'center',
  }}
>
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
  >
    <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 4 }}>
      Nos Projets
    </Typography>
  </motion.div>

  <Grid container spacing={4}>
    {/* Projet 1 */}
    <Grid item xs={12} sm={6} md={4}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <img
              src={t}
              alt="Projet 1"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
              Projet 1
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
              Découvrez notre premier projet innovant.
            </Typography>
          </CardContent>
          <CardActions>
            <Link to={`/projects/1`}>
              <Button size="small" color="primary">
                Voir plus
              </Button>
            </Link>
          </CardActions>
        </Card>
      </motion.div>
    </Grid>

    {/* Projet 2 */}
    <Grid item xs={12} sm={6} md={4}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
      >
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <img
              src={o}
              alt="Projet 2"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
              Projet 2
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
              Une solution sur-mesure pour vos besoins.
            </Typography>
          </CardContent>
          <CardActions>
            <Link to={`/projects/2`}>
              <Button size="small" color="primary">
                Voir plus
              </Button>
            </Link>
          </CardActions>
        </Card>
      </motion.div>
    </Grid>

    {/* Projet 3 */}
    <Grid item xs={12} sm={6} md={4}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
      >
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <img
              src={res}
              alt="Projet 3"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
              Projet 3
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
              Une approche innovante pour les défis modernes.
            </Typography>
          </CardContent>
          <CardActions>
            <Link to={`/projects/3`}>
              <Button size="small" color="primary">
                Voir plus
              </Button>
            </Link>
          </CardActions>
        </Card>
      </motion.div>
    </Grid>
  </Grid>
</Box>


{/* Section contact */}
<Box
  sx={{
    padding: '5%',
    backgroundColor: '#264653',
    color: '#FFE8D6',
    textAlign: 'center',
  }}
>
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
  >
    <Typography variant="h5" sx={{ marginBottom: 2 }}>
      Contactez-nous
    </Typography>
  </motion.div>

  {/* Animation pour les icônes */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1, delay: 0.3 }}
  >
    <Box>
      <IconButton
        sx={{
          color: '#F4A261',
          '&:hover': { transform: 'scale(1.1)', transition: '0.3s' },
        }}
        href="https://www.facebook.com/contactopen?mibextid=ZbWKwL"
        target="_blank"
      >
        <FacebookIcon />
      </IconButton>
      <IconButton
        sx={{
          color: '#F4A261',
          '&:hover': { transform: 'scale(1.1)', transition: '0.3s' },
        }}
        href="open.info.email@gmail.com"
        target="_blank"
      >
        <TwitterIcon />
      </IconButton>
      <IconButton
        sx={{
          color: '#F4A261',
          '&:hover': { transform: 'scale(1.1)', transition: '0.3s' },
        }}
        href="https://instagram.com"
        target="_blank"
      >
        <InstagramIcon />
      </IconButton>
    </Box>
  </motion.div>
</Box>

    </div>
  );
}

export default HomePage;
