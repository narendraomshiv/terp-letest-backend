const { db: db2 } = require("../db/db2")
const getAirline = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * FROM setup_liner")
		res.status(200).send({
			success: true,
			data: data,
		})
	} catch (error) {
		res.status(500).send({
			success: false,
			message: error,
		})
	}
}

const updateAirline = async (req, res) => {
	const { liner_id, liner_name, liner_code, liner_type_id } = req.body
	const sqlStatement =
		typeof liner_id === "undefined"
			? "INSERT INTO `setup_liner` (`liner_id`, `liner_type_id`, `liner_name`, `liner_code`, `status`, `created`, `updated`) VALUES (NULL, ?, ?, ?, 'on', current_timestamp(), current_timestamp())"
			: "UPDATE `setup_liner` SET `liner_type_id` = ?, `liner_name` = ?, `liner_code` = ?, `updated` = current_timestamp() WHERE `setup_liner`.`liner_id` = ?"
	const sqlValue =
		typeof liner_id === "undefined"
			? [liner_type_id, liner_name, liner_code]
			: [liner_type_id, liner_name, liner_code, liner_id]
	try {
		const [data] = await db2.query(sqlStatement, sqlValue)
		res.status(200).send({
			success: true,
			linerData: data,
		})
		return true
	} catch (error) {
		res.status(500).send({
			success: false,
			message: error,
		})
		return false
	}
}

const updateAirlineStatus = async (req, res) => {
	try {
		const { liner_id, status } = req.body
		const sqlStatement =
			"UPDATE `setup_liner` SET `status` = ? WHERE `setup_liner`.`liner_id` = ?"
		const sqlValue = [status, liner_id]
		const [data] = await db2.query(sqlStatement, sqlValue)
		res.status(200).send({
			success: true,
			linerData: data,
		})
		return true
	} catch (error) {
		res.status(500).send({
			success: false,
			message: error,
		})
		return false
	}
}

module.exports = {
	getAirline,
	updateAirline,
	updateAirlineStatus,
}
