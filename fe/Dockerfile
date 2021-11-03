# pull official base image
FROM node:16-alpine


WORKDIR /app
COPY package.json ./
RUN npm install --ignore-scripts --unsafe-perm

COPY . .

EXPOSE 3000

CMD ["npm", "start"]