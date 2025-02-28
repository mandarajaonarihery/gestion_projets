# Étape 1 : Image de base Node
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances de production
RUN npm install --production

# Copier le reste du code source
COPY . .

# Exposer le port de l'application (généralement 3000 pour Express)
EXPOSE 80

# Lancer l'application
CMD ["node", "server.js"]

