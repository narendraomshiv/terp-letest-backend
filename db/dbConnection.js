

const mysql = require("mysql")

let config = {
	host: "localhost",
	port: 8889,
	user: 'root',
	password: 'root',
	database: 'siameats_terp'
}

if (process.env.NODE_ENV === "production") {
	config = {
		host: "localhost",
		user: 'siameats_terpdbadmin',
		password: 'terpdbadmin@1oct',
		database: 'siameats_terp'
	}
}

const connection = mysql.createConnection({
	namedPlaceholders: true,
	...config,
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
