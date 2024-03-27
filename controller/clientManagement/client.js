const { db } = require("../../db/db2")

const addClient = async (req, res) => {
	try {
		const [rows] = await db.execute(
			"INSERT INTO clients (client_name, client_tax_number, client_email, client_phone, client_address, client_bank_name, client_bank_account, client_bank_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[
				req.body.client_name,
				req.body.client_tax_number,
				req.body.client_email,
				req.body.client_phone,
				req.body.client_address,
				req.body.client_bank_name,
				req.body.client_bank_account,
				req.body.client_bank_number,
			],
		)
		res.status(200).send({
			success: true,
			message: "Client Added Successfully"
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const getAllClients = async (req, res) => {
	try {
		const [rows] = await db.query("SELECT * FROM clients")
		res.status(200).send({
			success: true,
			message: "Getting Data Successfully",
			data: rows,
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const updateClientData = async (req, res) => {
	try {
		const [rows] = await db.execute(
			`UPDATE clients SET
		client_name = 				:client_name,
		client_tax_number = 	:client_tax_number,
		client_email = 				:client_email,
		client_phone = 				:client_phone,
		client_address = 			:client_address,
		client_bank_name = 		:client_bank_name,
		client_bank_account = :client_bank_account,
		client_bank_number = 	:client_bank_number
		WHERE client_id = 		:client_id`,
			{
				client_name: req.body.client_name,
				client_tax_number: req.body.client_tax_number,
				client_email: req.body.client_email,
				client_phone: req.body.client_phone,
				client_address: req.body.client_address,
				client_bank_name: req.body.client_bank_name,
				client_bank_account: req.body.client_bank_account,
				client_bank_number: req.body.client_bank_number,
				client_id: req.body.client_id,
			},
		)
		res.status(200).send({
			success: true,
			message: "Update Data Successfully"
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const getClientAsOptions = async (req, res) => {
	try {
		const [row] = await db.query("SELECT client_id, client_name FROM clients")
		return res.status(200).send({
			success: true,
			message: "Client Data Receiving Successfully",
			data: row,
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const clientShipTo = async (req, res) => {
	const {
		client_id,
		shipto_name,
		shipto_tax_number,
		Shipto_email,
		Shipto_phone,
		Shipto_address,
		port_id,
		rebate,
		commission,
		commission_value,
		currency,
		notify_name,
		notify_tax_number,
		notify_email,
		notify_phone,
		notify_address,
		margin,
	} = req.body
	const query =
		"INSERT INTO shiptos(client_id, shipto_name, shipto_tax_number, Shipto_email,Shipto_phone, Shipto_address, port_id, rebate, commission, commission_value, currency, notify_name, notify_tax_number, notify_email, notify_phone, notify_address, margin) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
	const values = [
		client_id,
		shipto_name,
		shipto_tax_number,
		Shipto_email,
		Shipto_phone,
		Shipto_address,
		port_id,
		rebate,
		commission,
		commission_value,
		currency,
		notify_name,
		notify_tax_number,
		notify_email,
		notify_phone,
		notify_address,
		margin,
	]

	try {
		await db.execute(query, values)
		res.status(200).send({
			success: true,
			message: "Ship To Added Successfully",
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const updateClientShipTo = async (req, res) => {
	try {
		await db.query(
			"UPDATE shiptos SET client_id = ?, shipto_name = ?, shipto_tax_number = ?, Shipto_email = ?, Shipto_phone = ?, Shipto_address = ?, port_id = ?, rebate = ?, commission=?, commission_value = ?, currency = ?, notify_name=?, notify_tax_number = ?,notify_email=?, notify_phone = ?, notify_address=?, margin = ? WHERE shipto_id = ?",
			[
				req.body.client_id,
				req.body.shipto_name,
				req.body.shipto_tax_number,
				req.body.Shipto_email,
				req.body.Shipto_phone,
				req.body.Shipto_address,
				req.body.port_id,
				req.body.rebate,
				req.body.commission,
				req.body.commission_value,
				req.body.currency,
				req.body.notify_name,
				req.body.notify_tax_number,
				req.body.notify_email,
				req.body.notify_phone,
				req.body.notify_address,
				req.body.margin,
				req.body.shipto_id,
			],
		)
		res.status(200).send({
			success: false,
			message: "Ship To Updated Successfully",
		})
		return
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const updateShipToStatus = async (req, res) => {
	const shipToId = req.body.shipto_id

	try {
		const [data] = await db.query(
			"SELECT status, shipto_id FROM shiptos WHERE shipto_id = ?",
			[shipToId],
		)
		const newStatus = data[0]?.status.toLowerCase() === "on" ? "off" : "on"
		await db.query("UPDATE shiptos SET status = ? WHERE shipto_id = ?", [
			newStatus,
			shipToId,
		])
		res.status(200).send({
			success: true,
			status: data[0]?.status.toLowerCase() === "on" ? "off" : "on",
			message: "ShipTo Status Updated Successfully",
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const getShipTo = async (req, res) => {
	try {
		const [data] = await db.query("SELECT * FROM shiptos")
		res.status(200).send({
			success: true,
			message: "Getting Data Successfully",
			data: data,
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const updateClientStatus = async (req, res) => {
	const clientId = req.body.client_id
	try {
		const [data] = await db.query(
			"SELECT status, client_id FROM clients WHERE client_id = ?",
			[clientId],
		)
		const updateStatus =
			`${data[0].status}`.toLocaleLowerCase() == "on" ? "off" : "on"
		await db.query(
			`UPDATE clients SET status = "${updateStatus}" WHERE client_id = "${clientId}"`,
		)
		res.status(200).send({
			success: true,
			status: updateStatus,
			message: "Client Status Updated Successfully",
		})
	} catch (error) {
		res.status(500).send({
			success: false,
			message: error,
		})
	}
}

module.exports = {
	addClient,
	getAllClients,
	updateClientData,
	getClientAsOptions,
	clientShipTo,
	updateClientShipTo,
	getShipTo,
	updateClientStatus,
	updateShipToStatus,
}
