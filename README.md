# Swedish, Norwegian BankID and Danish NemID in Node.js with OIDC
Finished sample, as described in https://grean.com/easyid/nodejs/oidc/2017/02/14/node-and-easyid.html

This sample illustrates how to set up a Node.js application that authenticates
users using *OpenID Connect* with one of the Scandinavian national or bank 
idenntities services. This is done with Grean's easyID as the middelman.

Out of the box this sample asks for authentication using Norwegian BankID.
Use the test user with 
**Fødselsnummer, Engangskode**, and **Personlig passord**  set to 
**15076400000, otp, qwer1234**


## Run the sample

1. Clone this repo
2. Inside the cloned repo, run `npm install`
3. To run simply execute it pointing to the easyID test tenant:
`DOMAIN=acme-corp.grean.id 
CLIENT_ID=urn:easyid:login-demo 
CLIENT_SECRET=LHla2/sf5OqbtCZ/0In9pm5HP1qWmuffUwxnhfSPReU= 
CALLBACK_URL=http://localhost:3000/callback 
npm start`  

## Try other authentication services

In order to try out some of the oher identity services, you must modify the 
setup of the OpenID strategy in `app.js`. See the blog post referenced at 
the top for possible values.

## Grean easyID
If you need to know the real identity of your users, spend a few minutes to hook
into the various national and bank identity services through Grean easyID. 
Sign up here: [grean.com/easyid](https://grean.com/easyid).
