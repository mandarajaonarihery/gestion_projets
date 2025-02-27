# Utilise l'image officielle de Node.js
FROM node:16

# Crée un répertoire dans le conteneur
WORKDIR /app

# Copie package.json et package-lock.json dans le répertoire de travail
COPY backend/package.json backend/package-lock.json /app/

# Installe les dépendances
RUN npm install --production

# Copie le reste du code
COPY backend /app

# Démarre l'application
CMD ["npm", "start"]
