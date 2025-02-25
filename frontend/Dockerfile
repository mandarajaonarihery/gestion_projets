# Étape 1 : Build de l’application
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer uniquement les dépendances de prod
RUN npm install --production

# Copier tout le code source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Image finale avec NGINX pour servir le frontend
FROM nginx:alpine

# Copier les fichiers buildés vers NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Lancer NGINX
CMD ["nginx", "-g", "daemon off;"]
