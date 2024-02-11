const mysql2 = require("mysql2/promise")
const db2 = mysql2.createPool({
	namedPlaceholders: true,
	host: "localhost",
	user: "siameats_terpdbadmin",
	password: "terpdbadmin@1oct",
	database: "siameats_terp",
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
