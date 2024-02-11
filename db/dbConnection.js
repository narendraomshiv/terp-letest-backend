require("dotenv").config()

const mysql = require("mysql")

const connection = mysql.createConnection({
	namedPlaceholders: true,
	host: "localhost",
	port: "8889",
	user: "root",
	password: "root",
	database: "siameats_terp",
	timeout: "10000",
})

connection.connect((error) => {
	if (error) {
		console.log(error)
	} else {
		console.log("Database Connected Successfully")
	}
})

module.exports = connection
