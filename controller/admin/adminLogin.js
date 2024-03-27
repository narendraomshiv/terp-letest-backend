const bcrypt = require("bcryptjs")
const moment = require("moment")
const { db } = require("../../db/db2")

const adminLogin = async (req, res) => {
	const password = req.body.password

	try {
		if (!req.body.email || req.body.email == " " || req.body.email == null)
			throw new Error("email is empty!")
		if (
			!req.body.password ||
			req.body.password == " " ||
			req.body.password == null
		)
			throw new Error("password is empty!")
			
		const [rows, fields] = await db.execute(
			"SELECT id, role, name, email, email_verified_at, remember_token, status, last_login,created_at, updated_at, password FROM users WHERE email = ?",
			[req.body.email],
		)
		//console.log(!rows.length);
		if (!rows.length) throw new Error("Username Incorrect")

		/* var hash = bcrypt.hashSync('12345678', 8);
		await db.execute("UPDATE users SET password = ? WHERE id = ?", [
			hash, rows[0].id,
		])  */

		if (!(await bcrypt.compareSync(password, rows[0].password)))
			throw new Error("Username Or Password Incorrect")
		await db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
			rows[0].id,
		])
		res.status(200).send({
			success: true,
			message: "Login Successfully",
			user: { ...rows[0], password: undefined },
		})
	} catch (err) {
		return res.status(500).send({
			success: false,
			msg: err.message,
		})
	}
}

module.exports = adminLogin


// admin- admin@123
// super-admin- superadmin@123