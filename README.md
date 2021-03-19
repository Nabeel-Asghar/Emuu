# PhotoSpot-App

Photospot startup. This will be done with React, Express.js, and Firebase

To run the app on your computer, you must have node.js installed.

Once you clone the project, make sure to install all dependencies with npm.

**To run this backend locally, run:**
```
cd ./photospot-backend
```
```
firebase serve
```

**To run the front end locally run:**
```
cd ./photospot-client
```
```
npm start
```

**To forward webhooks to your local backend, navigate to the Stripe folder in the root directory then run:**
```
start stripe.exe
```
```
stripe listen --forward-to http://localhost:{YOUR_PORT}/photospot-5f554/us-central1/api/webhooks
```
