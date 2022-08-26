# Chatroom Backend

![CI/CD](https://github.com/RyanLin11/chatroom-backend/actions/workflows/main.yml/badge.svg)

## Getting Started

### Step 1: Add Environment Variables
Create a `.env` file with the following contents:
```
FRONTEND_URL=<key> # Used to configure CORS
PORT=<port> # Internal port of the service
MONGODB_URL=<url> # Connection string
SESSION_SECRET=<secret> # Securing express-session
```

### Step 2: Run Dev Environment
Prerequisite: Make sure Docker is installed. 
1. Run `make setup` to initialize a volume to hold node_modules.
2. Run `make install` to populate the volume with node packages.
3. Run `make dev` to build and run the backend container, which uses the node_modules external volume.

### Step 3: Deploying
There is a `Dockerfile` configured for production.
If you are a contributor to this repository, note that this app is deployed on fly.io. Through Github Actions, fly.io builds the app using `Dockerfile` when there is a push or pull request to the `main` branch.

### API URL
The API can be accessed at [https://letschat.fly.dev/](https://letschat.fly.dev/)