# Utilise une image Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Reconstruire bcrypt spécifiquement
RUN npm rebuild bcrypt --build-from-source

# Copier le reste du code
COPY . .

# Exposer le port utilisé par ton backend
EXPOSE 5000

# Lancer l'application
CMD ["npm", "start"]
