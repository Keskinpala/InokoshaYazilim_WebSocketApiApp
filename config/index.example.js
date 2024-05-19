
export default
{
    debug: true,
    host: 'localhost',
    // MySQL configuration
    mysql: {
        host: 'localhost',
        user:"example_user",
        password:"",
        database:"example_db",
    },

    // Web server configuration
    webserver: {
        port: 15090
    },

    // Socket server configuration
    sockserver: {
        port: 15091,
        apikey: 'custom'
    },
    discordConnectionWebhook: ""
}