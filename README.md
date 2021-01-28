## Passport Auth and node JS.

This is a sample project to start with Facebook, Google, Linkedin and Microsoft authentication using nodeJS. 

### Prerequisites 

1. Install Node and NPM
2. Basic knowledge of HTML, JS

### How to start 

1. Clone the repository
2. Go to the directory `passportAuth`

```
cd passportAuth\
```
3. Enter the follwoing command 

```
npm install
```
4. Rename the file `config.example.js` to `config.js` in your code editor and replace all the follwoing <APP_ID> and <APP_SECRET> with your Social apps id and secret.

`````` JS
module.exports = {
  'facebookAuth': {
    'clientID': '<APP_ID>', // your App ID 
    'clientSecret': '<APP_SECRET>', // your App Secret
    'callbackURL': 'https://localhost:3000/auth/facebook/callback'
  },
  ...
}

``````

5. Create Certificates for localhost
``````
sudo openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
``````

6. Save/Copy files 'key.pem' and 'cert.pem' to root path

7. Then run the follwoing command in your terminal

```
npm start
```
6. Open the link [https://localhost:3000](https://localhost:3000)

