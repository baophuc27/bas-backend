
## BAS API Backend

  The bas backend is the backend of the soft pipe management (bas) application.

## Requirements

- Node (v.18.20.0)
- Git

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://gitlab.com/dzungnt98/bas-back-end.git
cd bas-api
```

```bash
npm install
```

## Steps for run application

To start the express server, run the following

```bash
npm run start
```
or 
```bash
yarn start
```

Open [http://localhost:8000](http://localhost:8000) and take a look around.


## Use Docker

You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone <repo - link>
```

Step 2: Build the Docker image

```bash
docker build -t bas-api:least .
```

Step 3: Run the Docker container locally:

```bash
docker run -p 8000:8000 -d bas-api:least
```
