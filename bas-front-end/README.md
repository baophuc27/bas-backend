### BAS Front-end
#### 1. [Introduction](#introduction)
BAS frontend is a web application that allows users to interact with the BAS system. It is built using React and Redux. 

#### 2. [Installation](#installation)
To install the frontend, you need to have Node.js with version 18.20.0 installed on your machine. You can download Node.js from [here](https://nodejs.org/en/download/). After installing Node.js, you can install the frontend by running the following commands in the terminal:
```bash
    git clone <repository-url> 
    cd bas-frontend
    npm install
```
Add .env 
```bash
    REACT_APP_API_BASE_URL=http://localhost:8000 # domain of the backend
    REACT_APP_API_URL=http://localhost:8000/api/v1 # domain of the backend with the api version
```

#### 3. [Usage](#usage)

To start the frontend, run the following command in the terminal:
```bash
    npm start
```


#### 4. [Development](#development)
Bas frontend is built using Docker. There are two files. One is the Dockerfile and the other is the docker-compose.yml file. The Dockerfile is used to build the image of the frontend and the docker-compose.yml file is used to run the frontend in a container. To build the image, run the following command in the terminal:

```bash
    docker compose -f <path-to-docker-compose.yml> up -d --build
```
When rebuilding the image, you need to remove the existing image by running the following command in the terminal:
```bash
    docker compose -f <path-to-docker-compose.yml> down
```


