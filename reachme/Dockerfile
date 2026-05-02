FROM node:24

COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
