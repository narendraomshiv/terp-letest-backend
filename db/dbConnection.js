

const mysql = require("mysql")

/* let config = {
	host: "162.241.86.206",
	//port: '8889',
	user: 'mobap6fg_terp',
	password: 'mRTm2El35$ao',
	database: 'mobap6fg_terpdb'
} */

let config = {
	host: "localhost",
	port: '3306',
	user: 'root',
	password: '',
	database: 'terpdp'
	//database:'db_terp'
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

// Which view or table do you want to change?