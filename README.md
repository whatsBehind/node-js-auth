# Introduction

This project is for learning purpose. It is a practice of 
1. how to use JWT (Json Web Token) to authenticate user
2. login with Google using OAuth2

## Tech Stack
- `Node.js`
- `Express`: Quickly start a local host
- `MongoDB/Mongoose`: Database to store users
- `@hapi/joi`: Package to validate parameters of objects
- `bcryptjs`: Hash confidential information including passwords in this project
- `jsonwebtoken`: JWT package to sign and verify a auth token
- `axios`: Send HTTP requests
- `querystring`: Package to parse and assembly query string in HTTP request

## Reference
- [Implement JWT using node.js and express](https://www.youtube.com/watch?v=2jqok-WgelI): Very nice video which guides me step by step to build this project
- [Google OAuth2 with node.js](https://www.youtube.com/watch?v=Qt3KJZ2kQk0&t=6s): Video that explains and implements OAuth2 flow from end to end
- [OAuth 2.0 and OpenID Connect](https://www.youtube.com/watch?v=996OiexHze0): Plain English explains the evolution of OAuth2 and OpenID Connect

## What Is JWT?
A JWT (JSON Web Token) is like a compact digital note or a small piece of data that web servers and clients (like your browser or a mobile app) use to communicate secure information. It's like a tiny, encoded message.

### Structure of JWT
A JWT is made up of three parts, each encoded in base64 and separated by dots (`.`):

- **Header**: The header typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as SHA256 or RSA.
- **Payload**: The payload contains information of the identity, like id, isa(issuedAt), and etc...
- **Signature**: This is the secure part of JWT. It is created by taking encoded header, encoded payload, a secret only known by the server, then running it through the signing algorithm mentioned in the header. If the algorithm is 
    - Symmetric algorithm (like `HS256`): The same secret is used for signing and verification
    - Asymmetric algorithm (like `RS256`): A private key will be used for signing, and a corresponding public key will be used for verification

### Risk of JWT
- Data is Not Encrypted
    - The first two parts of a JWT token are only base64 encoded, but not encrypted, so everyone can decode them and read data directly. Hence, confidential information should not be stored in the payload
- Susceptible to Theft
    - If a JWT is stolen, it could by used by unauthorized parties to gain access to the system
- No Revocation Mechanism
    - Once issued, a JWT can't be revoked before it expires
- Key Management Challenges
    - The security of JWT depends on how secret key is managed by the server. If the secret is not well managed or securely stored, it could lead security vulnerabilities

### Best Practice 
- Use HTTPS to prevent interception of tokens.
- Keep expiration times as short as practical.
- Avoid storing sensitive data in the token.
- Implement token refresh mechanisms.
- Securely manage signing keys.

## API
### Register
- Url: `/api/user/register`
- Method: `POST`
- Request
    - Body
        ```
        {
            name: string,
            email: string,
            password: string
        }
        ```
- Response
    - Body
        ```
        {
            userId: string
        }
        ```
- Business logic
    - Validate parameters in the request body
    - Validate email is not registered in DB
    - Insert a new user in DB

### Login
- Url: `/api/user/login`
- Method: `POST`
- Request
    - Body
        ```
        {
            email: string,
            password: string
        }
        ```
- Response
    - Header
        ```
        {
            auth-token: string
        }
        ```
    - Body
        ```
        {
            token: string
        }
        ```
- Business logic
    - Verify if email and password match
    - Sign a new JWT and return it 

### Posts
- Url: `/api/posts`
- Method: `GET`
- Request
    - Header
        ```
        {
            auth-token: string
        }
        ```
- Response
    - Body
        ```
        {
            posts: {
                title: string,
                description: string
            }
        }
        ```
- Business logic
    - Verify the `auth-token` from request headers
    - Return a hard-coded post object

After users login, server signs a JWT to users. By include the JWT in the request headers, server could verify it to determine if user is authenticated (login)

## OAuth2

### What is OAuth2?

OAuth2 is an open standard for access delegation, which is commonly used as the way for internet users to grant a client or application access to their resources under another server without sharing their passwords

### Why OAuth2?

- Secure Delegation of Access: Users often need to grant a third party website or application access to their data on another service (like accessing your google account from a social media app). Sharing credentials for this purpose is highly insecure

- Fine Grained Authorization: User may not want to give full access of their all data

- Standardization and Interoperability: With requirements of authentication and authorization from many internet service, a standard way is needed

- Reducing Password Fatigue: Users are overwhelmed by the need to create username and password for each single service

### Key Components of OAuth2
- Resource Owner: The user who authorizes an application to access their account
- Client: The application that wants to access user's account
- Resource Server: The server hosting user's data
- Authorization Server: The server that authenticates user and issues access token to the application

### How OAuth2 works
![image](./static/oauth2/oauth2-authorization.svg)
- Authorization Request
    - The client requests authorization to access user's resources. This is usually done through a redirection, where client passes along its identity (client id) and the scope of the access it's requesting

- User Authenticate and Consent
    - The user is asked to login to the authorization server and to approve the requested access by the client

- Authorization Grant
    - Upon successful authentication and consent, authorization server issues an authorization grant to the client. The authorization grant can be of different type, like an authorization code or an implicit grant, depending on the OAuth flow being used

- Access Token Request (In case of authorization code grant)
    - If an authorization code is granted, then client exchanges the code for an access token. This is done by sent a request to authorization server's token endpoint where client authenticates itself and presents the authorization code

- Issuance of Access Token
    - The authorization server authenticates the client validates the authorization grant and if valid issues an access token (and possibly a refresh token)

- Accessing the Resource 
    - The client uses access to token to make a request to the resource server for the protected resources

- Resource Server Validates Token
    - The resource server validates the token and if valid serves the request

- Resource Deliver 
    - The client receives the protected resources

### Why OpenID Connect
OAuth2 was originally designed for authorization, but not for authentication. Different companies have their own standards to authenticate users using OAuth2, in other words, OAuth2 is overused for authentication. 

OpenID Connect is an authentication layer built on top of OAuth2. It was developed to address the need for a standardized authentication process.

### How OpendID Connect works
- Authentication Request
    - The client includes `openid` in the scope of the authorization request. That indicates that the client is requesting an ID token in addition to access token
- Token Response 
    - Access Token: Just like OAuth2, access token is issued by the authorization server. This token grants access to user's resources
    - ID Token: This is unique to OpenID Connect. The ID token is a JWT which contains claims about user's identity and profile
Token Validation
    - Upon receiving the tokens, the client must validate the ID tokens to ensure its integrity and authenticity. This involves verifying JWT signature and the claims it contains
