# nodejs-ready-healthy-app

This is a Node.js app that exposes both health and readiness endpoints.

You shouldn't stop your Node.js from starting if connections to external services are not available. Instead, you should expose a readiness endpoint that returns a 200 status code when the app is ready to serve requests.

## Health

The health endpoint is exposed at `/health` and returns a 200 status code if the app is healthy.

## Readiness

The readiness endpoint is exposed at `/ready` and returns a 200 status code if the app is ready.

## Running the app

To run the app, run the following command:

```bash
npm start
```

You should be able to visit the health endpoint at http://localhost:5000/health and the readiness endpoint at http://localhost:5000/ready.

You should see the app is neither ready nor healthy.

Start Redis by running the following command:

```bash
docker-compose up
```

Now both the health and readiness endpoints should return a 200 status code.
`
