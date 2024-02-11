const mysql = require("mysql")

const connection = mysql.createConnection({
	namedPlaceholders: true,
	host: "localhost",
	user: "siameats_terpdbadmin",
	password: "terpdbadmin@1oct",
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
