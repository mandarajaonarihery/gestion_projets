# Utilise une image Node.js légère
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY backend/package*.json ./

# Installer les dépendances
RUN npm install

# Reconstruire bcrypt spécifiquement si nécessaire
RUN npm rebuild bcrypt --build-from-source

# Copier le reste du code backend
COPY backend/. .

# Exposer le port utilisé par le backend
EXPOSE 5000

# Lancer l'application
CMD ["node", "server.js"]
