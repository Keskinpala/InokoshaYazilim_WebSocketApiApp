# WebSocket Database Project
[![InokoshaYazilim](https://inokosha.com.tr/inokoshalogo.png)](https://inokosha.com.tr)
## Overview
This project demonstrates a real-time WebSocket server built with Node.js that interacts with a database. The server allows clients to connect with apikeys, managament with user, apikey message privacy to send message, and receive only apikey sended data in real-time, which is then stored and retrieved from a database.

## Features
- Real-time communication via WebSocket.
- Persistent data storage using a database (MySQL).[Project include only MySQL]
- Modular and scalable architecture.
- Home Page(URL:"/") has heartbeat 
- Secure API key management.

## Prerequisites
- Node.js (v14 or higher recommended)
- npm (v6 or higher)
- A running database instance (e.g., MySQL)
- An API key for secure communication

## Installation

1. Clone the repository:
    ```bash
    git clone Keskinpala/InokoshaYazilim_WebSocketApiApp
    cd InokoshaYazilim_WebSocketApiApp
    ```

2. Install dependencies:
    ```bash
    npm install or npm i
    ```

3. Configure the environment:
    - Rename `../config/index.example.js` to `../config/index.js`:
    - Rename `../db/migration.example.js` to `../db/migration.js`:
    - Change variables on config/index.js to your values
    - Generate sql for migration like "Create USER"

## Usage

1. Start the server:
    ```bash
    node index.js
    ```

2. Connect to the WebSocket server using a WebSocket client and include your API key in the get parameters like 'ws://localhost:15091?apikey=XXXXXXXX' for authentication.


## License

Entrust is free software distributed under the terms of the MIT license.

Please report any issue you find in the issues page.  
Pull requests are welcome.