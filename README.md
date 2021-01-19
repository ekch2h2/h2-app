# Overview
This is the package that powers [H2 App](https://ekch2h2.github.io/h2-app/) for ecc-h2 fellowship.

# Test User Info
* Username: user123@email.com
* Pswd: 123456

# Deployment
## Frontend
The website is hosted with [GitHub Page](https://pages.github.com/), when you have made a code change
and want to bring the change to live, just run the following command
```bash
cd webapp
npm run deploy
```

## Backend
The backend of the app is built with firebase, and they are implemented
as [firebase cloud functions](https://firebase.google.com/docs/functions).

After you have made changes to functions, you can deploy the changes with
```bash
cd functions
npm run deploy
```