import express from 'express'
import { WebSocketServer } from 'ws'
import mysql from 'mysql'
import config from './config/index.js'
import db from './db/db.js'
import migration from './db/migration.js'
import fetch from 'node-fetch';

//check table after start app db.js has checkTables function
db.checkTables().then((countTable) => {
    console.log(countTable)
    if(countTable===0){
        migration.up()
    }
})
//await for migration up
await new Promise(resolve => setTimeout(resolve, 2000));



const webserver = express()
// websocket only usable with api key else not to use

let Clients=[]

const Connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
    })


const sockserver = new WebSocketServer({ port: config.sockserver.port 
,verifyClient: function(info, cb) {
    try{

  
    const apikey =  info.req.url.split('apikey=')[1]
    Connection.query('SELECT * FROM apikeys WHERE apikey = ?', [apikey], function (error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {
            cb(true)
        } else {
            cb(false, 401, 'Unauthorized')
        }
    })
  }

catch(e){
    console.log(e)
}
}

})

console.log(`Listening on ${config.sockserver.port}`)

//webserver test
webserver.get('/', (req, res) => {
    //check all 
    let status=true
    let json = {}
    Connection.connect()
    try{
        Connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error) throw error;
        
        });
    }
    catch(e){
        status=false
    }
    Connection.end()
    
    //check websocket status is connectable
    try{
        const ws = new WebSocket(`ws://${config.host}:${config.sockserver.port}?apikey=${config.sockserver.apikey}`)
        ws.on('open', function open() {
            ws.send('something');
        });
        ws.on('message', function incoming(data) {
            console.log(data);
        });
        ws.on('close', function close() {
            console.log('disconnected');
        });
    }
    catch(e){
        status=false
    }

    if(status){
       res.status(200).json(json)
    }
    else{
        res.status(500).json(json)
    }
 
    res.end()

}
)
webserver.listen(config.webserver.port, () => console.log(`Listening on ${3000}`))
//connection with api key websocket send message to only connected apikey user
try{
sockserver.on('connection', (ws,req) => {
    const apikey= req.url.split('apikey=')[1]
    const ip = req.socket.remoteAddress
    const webhook = config.discordConnectionWebhook
    console.log("New client connected! "+apikey+" api keyi ile bağlandı")
    Connection.query('SELECT * FROM apikeys WHERE apikey = ?', [apikey], function (error, results, fields) {
    if (error) throw error;
    if (results.length === 1) {

        Object.keys(Clients).find(key => key.includes(apikey)) ? Clients[apikey].push(ws) : Clients[apikey] = [ws]
        // connection established add to connections
        Connection.query('INSERT INTO connections (ip, date,type, user_id) VALUES (?, ?, ?,?)', [ip, new Date(),'connect', results[0]['user_id']], function (error, results, fields) {
            if (error) throw error;
        })
        //discord webhook
     
        const data = {
            content: apikey +' ile ' + ip +' ip adresinden bağlantı yapıldı'
        }
        if(webhook!==undefined && webhook!==null && webhook!=='')
        fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    
        ws.send('connection established')
    } else {
      
        const data = {
            content: apikey +' ile ' + ip +' ip adresinden yetkisiz bağlantı yapıldı'
        }
        if(webhook!==undefined && webhook!==null && webhook!=='')
        fetch(webhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        ws.close()
    }
})
ws.on('close', () => {
    Connection.query('SELECT * FROM apikeys WHERE apikey = ?', [apikey], function (error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {
            Clients[apikey].splice(Clients[apikey].indexOf(ws), 1)
            Connection.query('INSERT INTO connections (ip, date,type, user_id) VALUES (?, ?, ?,?)', [ip, new Date(),'disconnect', results[0].user_id], function (error, results, fields) {
                if (error) throw error;
            })
        }
    })
    //discord webhook
  
    const data = {
        content: apikey +' ile ' + ip +' ip adresinden bağlantı kesildi'
    }
    if(webhook!==undefined && webhook!==null && webhook!=='')
    fetch(webhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    console.log('Client has disconnected! '+ apikey+' api keyi ile bağlantı kesildi')
})
ws.on('message', data => {
    Connection.query('SELECT * FROM apikeys WHERE apikey = ?', [apikey], function (error, results, fields) {
        if (error) throw error;
        if (results.length === 1) {

            Connection.query('INSERT INTO messages (message, date, user_id) VALUES (?, ?, ?)', [data, new Date(), results[0].user_id], function (error, results, fields) {
                if (error) throw error;
            })
            Clients[apikey].forEach(client => {
                console.log(`distributing message: ${data}`)
                client.send(`${data}`)
            })
        }
    })

    
}
)
ws.onerror = function () {
    console.log('websocket error')
}

    })
}
catch(e){
    console.log(e)
}

//socket test
// sockserver.on('connection', ws => {
//     console.log('New client connected!')
//     ws.send('connection established')
//     ws.on('close', () => console.log('Client has disconnected!'))
//     ws.on('message', data => {
//       sockserver.clients.forEach(client => {
//         console.log(`distributing message: ${data}`)
//         client.send(`${data}`)
//       })
//     })
//     ws.onerror = function () {
//       console.log('websocket error')
//     }
//    })



//on app close remove all connection
process.on('exit', function () {
    Connection.end()
    console.log('exit')
})