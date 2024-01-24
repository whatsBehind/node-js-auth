# Introduction

This project is for learning purpose. It is a practice of how to use JWT (Json Web Token) to authenticate user. 

## Tech Stack
- Node.js
- Express: Quickly start a local host
- MongoDB/Mongoose: Database to store users
- @hapi/joi: Package to validate parameters of objects
- bcryptjs: Hash confidential information including password in this project
- jsonwebtoken: JWT package to sign and verify a auth token

## Reference
- [YouTube Video](https://www.youtube.com/watch?v=2jqok-WgelI): Very nice video which guide mes step by step to build this project

## What Is JWT?
A JWT (JSON Web Token) is like a compact digital note or a small piece of data that web servers and clients (like your browser or a mobile app) use to communicate secure information. It's like a tiny, encoded message.

### Structure of JWT
A JWT is made up of three parts, each encoded in base64 and separated by dots (`.`):

- **Header**: The header typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as SHA256 or RSA.
- **Payload**: The payload contains information of the identity, like id, isa(issuedAt), and etc...
- **Signature**: This is the secure part of JWT. It is created by taking encoded header, encoded payload, a secret only known by the server, then running it through the signing algorithm mentioned in the header. If the algorithm is 
    - Symmetric algorithm (like `HS256`): The same secret is used for signing and verification
    - Asymmetric algorithm (like `RS256`): a private key will be used for signing, and a corresponding public key will be used for verification

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