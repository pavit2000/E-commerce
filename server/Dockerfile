FROM node:22
# starts node image

WORKDIR /app
# sets the working directory to /app

COPY package.json package-lock.json ./
# copies package.json and package-lock.json to /app


RUN npm ci --omit=dev
# installs dependencies without dev dependencies        

COPY . .
# copies the rest of the application code to /app


EXPOSE 5001
# exposes port 5001 for the application

CMD ["node", "server.js"]
# starts the application by running server.js