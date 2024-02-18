
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

const mysql2 = require("mysql2/promise")
const db2 = mysql2.createPool({
	namedPlaceholders: true,
	...config,
	waitForConnections: true,
	connectionLimit: 32,
	maxIdle: 12, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
	multipleStatements: true,
	compress: true,
})
module.exports = { db: db2 }
