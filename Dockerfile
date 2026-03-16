FROM node:20-alpine AS builder

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

ARG MONGODB=mongodb://127.0.0.1:27017/deeplocal
ARG REFRESH_EXPIRES_IN=2592000
ARG ACCESS_EXPIRES_IN=300
ARG SECRET="cat"
ARG PORT=3000
ARG ORIGIN=""
ARG SUPABASE_URL=""
ARG SUPABASE_SERVICE_ROLE_KEY=""
ARG ICON_BUCKET="icons"
ARG AVATAR_BUCKET="avatars"
ARG BACKGROUND_BUCKET="backgrounds"

CMD ["npm", "run", "prod"]
