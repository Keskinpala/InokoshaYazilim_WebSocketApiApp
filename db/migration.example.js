import  config  from '../config/index.js';
import mysql from 'mysql';
export default{
//migration
generateApiKeys: function(){
    const apikeys = []
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 50; i++) {
        apikeys.push(characters.charAt(Math.floor(Math.random() * characters.length)))
    }
    return apikeys.join('')
}
,
up: function() {
    const Connection = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
        })
    Connection.connect()
    Connection.query('CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))', function (error, results, fields) {
        if (error) throw error;
        console.log('Kullanıcı tablosu oluşturuldu: ', results);
        //eng
        console.log('User table created: ', results);
    });
    Connection.query('CREATE TABLE apikeys (id INT AUTO_INCREMENT PRIMARY KEY, apikey varchar(50), user_id INT, FOREIGN KEY (user_id) REFERENCES users(id))', function (error, results, fields) {
        if (error) throw error;
        console.log('Api tablosu oluşturuldu: ', results);
        //eng
        console.log('Api table created: ', results);

    });
//connection save ip date time user
    Connection.query('CREATE TABLE connections (id INT AUTO_INCREMENT PRIMARY KEY, ip VARCHAR(255),type varchar(20), date DATETIME, user_id INT, FOREIGN KEY (user_id) REFERENCES users(id))', function (error, results, fields) {
        if (error) throw error;
        console.log('Bağlantı tablosu oluşturuldu: ', results);
        //eng
        console.log('Connection table created: ', results);

    });

    //send message count
    Connection.query('CREATE TABLE messages (id INT AUTO_INCREMENT PRIMARY KEY, message TEXT, date DATETIME, user_id INT, FOREIGN KEY (user_id) REFERENCES users(id))', function (error, results, fields) {
        if (error) throw error;
        console.log('Mesaj tablosu oluşturuldu: ', results);
        //eng
        console.log('Message table created: ', results);
    });

    //kullanıcı oluştur
    Connection.query('INSERT INTO users (name, email, password) VALUES ("inokosha", "inokosha.com.tr", "inokoshaYazilim")', function (error, results, fields) {
        if (error) throw error;
        console.log('Kullanıcı oluşturuldu: inokosha', results);
        //eng
        console.log('User created: inokosha', results);
    })




    Connection.end()
},
    
down: function() {
    const Connection = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database
        })
    Connection.connect()
    Connection.query('DROP TABLE users', function (error, results, fields) {
        if (error) throw error;
        console.log('Drop table: ', results);
    });
    Connection.query('DROP TABLE apikeys', function (error, results, fields) {
        if (error) throw error;
        console.log('Drop table: ', results);
    });
    Connection.query('DROP TABLE connections', function (error, results, fields) {
        if (error) throw error;
        console.log('Drop table: ', results);
    });
    Connection.query('DROP TABLE messages', function (error, results, fields) {
        if (error) throw error;
        console.log('Drop table: ', results);
    });
    Connection.end()

}
}