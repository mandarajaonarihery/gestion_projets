# Utiliser une image Node.js pour construire le frontend
FROM node:18 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Copier le fichier .env pour l'utiliser pendant la construction
COPY .env .env

# Installer les dépendances
RUN npm install

# Copier le reste du code du frontend
COPY . .

# Construire l'application
RUN npm run build

# Étape finale : utiliser une image nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour accéder au frontend
EXPOSE 80

# Commande par défaut pour démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
