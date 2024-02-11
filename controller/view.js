const { db: db2 } = require("../db/db2")

const getTransportation_Supplier = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * FROM `Transportation_Supplier`")
		res.status(200).json({
			message: "All Wage",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}
const getFreight_Supplier = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * FROM `Freight_suppliers`")
		res.status(200).json({
			message: "All Wage",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const getdropdown_commission_type = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * from dropdown_commission_type", [])
		res.status(200).json({
			message: "All Wage",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const getChartOfAccounts = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * from Chart_of_Accounts", [])
		res.status(200).json({
			message: "All Wage",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}
module.exports = {
	getTransportation_Supplier,
	getFreight_Supplier,
	getdropdown_commission_type,
	getChartOfAccounts,
}
