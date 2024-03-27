const { db: db2 } = require("../db/db2")

const getConsignee = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * FROM `consignee`")
		res.status(200).json({
			message: "All Consignee",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const updateConsignee = async (req, res) => {
	const {
		consignee_id,
		CODE,
		brand,
		client_id,
		consignee_name,
		consignee_tax_number,
		consignee_email,
		consignee_phone,
		consignee_address,
		Default_location,
		port_of_orign,
		destination_port,
		liner_Drop,
		profit,
		rebate,
		commission,
		commission_value,
		Commission_Currency,
		currency,
		notify_name,
		notify_tax_number,
		notify_email,
		notify_phone,
		notify_address,
	} = req.body

	console.log(req.body);
	try {
		await db2.execute(
			/* sql */ `UPDATE consignee 
			SET CODE = ?,
			brand = ?,
			client_id = ?,
			consignee_name = ?,
			consignee_tax_number = ?,
			consignee_email = ?,
			consignee_phone = ?,
			consignee_address = ?,
			Default_location = ?,
			port_of_orign = ?,
			destination_port = ?,
			liner_Drop = ?,
			profit = ?,
			rebate = ?,
			commission = ?,
			commission_value = ?,
			Commission_Currency = ?,
		    currency = ?,
			notify_name = ?,
			notify_tax_number = ?,
			notify_email = ?,
			notify_phone = ?,
			notify_address = ?
			WHERE consignee.consignee_id = ?`,
			[
				CODE,
				brand,
				client_id,
				consignee_name,
				consignee_tax_number,
				consignee_email,
				consignee_phone,
				consignee_address,
				Default_location,
				port_of_orign,
				destination_port,
				liner_Drop,
				profit,
				rebate,
				commission,
				commission_value,
				Commission_Currency,
				currency,
				notify_name,
				notify_tax_number,
				notify_email,
				notify_phone,
				notify_address,
				consignee_id,
			],
		)
		res.json({
			message: "Consignee Updated",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const createConsignee = async (req, res) => {
	const {
		CODE,
		brand,
		client_id,
		consignee_name,
		consignee_tax_number,
		consignee_email,
		consignee_phone,
		consignee_address,
		Default_location,
		port_of_orign,
		destination_port,
		liner_Drop,
		profit,
		rebate,
		commission,
		commission_value,
		Commission_Currency,
		currency,
		notify_name,
		notify_tax_number,
		notify_email,
		notify_phone,
		notify_address,
	} = req.body
	console.log(req.body);
	try {
		await db2.query(
			/*sql*/ `INSERT INTO consignee (CODE, brand, client_id, consignee_name,
			 consignee_tax_number, consignee_email, consignee_phone, consignee_address,
			  Default_location, port_of_orign, destination_port,
				 liner_Drop, profit, rebate, commission,
				  commission_value, Commission_Currency, currency, notify_name, notify_tax_number,
					 notify_email, notify_phone, notify_address)
			 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
			[
				CODE,
				brand,
				client_id,
				consignee_name,
				consignee_tax_number,
				consignee_email,
				consignee_phone,
				consignee_address,
				Default_location,
				port_of_orign,
				destination_port,
				liner_Drop,
				profit,
				rebate,
				commission,
				commission_value,
				Commission_Currency,
				currency,
				notify_name,
				notify_tax_number,
				notify_email,
				notify_phone,
				notify_address,
			],
		)
		res.json({
			message: "Consignee Created",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}
module.exports = { getConsignee, updateConsignee, createConsignee }

