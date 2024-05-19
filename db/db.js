import mysql from 'mysql'
import config from '../config/index.js'
export default{

    checkTables:async function() {
        const Connection = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database
            })
     
            let arr=[]
        Connection.connect()
        Connection.query('SHOW TABLES', function (error, results, fields) {
            if (error) throw error;
            console.log("--------------------\n Tables in the database\n--------------------")
                for (let i = 0; i < results.length; i++) {
                console.log(results[i])
                arr.push(results[i])
            }
            console.log(results.length + " tables in the database\n--------------------")
       
            console.log("--------------------")
        
        });
        Connection.end()
        //await for connection end
        await new Promise(resolve => setTimeout(resolve, 1000));
        return arr.length


    }

}