const { db: db2 } = require("../../db/db2")
const { getEanPerKg } = require("../../function/getEanperKG")

const getEanDeatils = async (req, res) => {
	try {
		const [data] = await db2.query(
			"SELECT * FROM ean_details WHERE ean_id = ?",
			[req.query.id],
		)
		res.status(200).json({
			message: "All Wage",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: err,
		})
	}
}

const addEanDetails = async (req, res) => {
	try {
		const { ean_id, data } = req.body
		for (const d of data) {
			await db2.execute(
				"INSERT INTO ean_details (ean_id, detail_type, item_id, quantity_per_ean) VALUES (?,?,?,?)",
				[ean_id, +d.detail_type, d.item_id, d.quantity_per_ean],
			)
		}
		await db2.execute(
			"UPDATE ean SET estimated_EAN_PER_KG = ? WHERE ean_id = ?",
			[getEanPerKg(data), ean_id],
		)
		res.status(200).json({
			message: "Ean Details Added Successfully",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const updateEanDetails = async (req, res) => {
	const { ean_id, data } = req.body
	try {
		for (const d of data.filter((v) => v.ean_detail_id)) {
			await db2.execute(
				"UPDATE ean_details SET detail_type = ?, item_id = ?, quantity_per_ean = ? WHERE ean_detail_id = ?",
				[d.detail_type, d.item_id, d.quantity_per_ean, d.ean_detail_id],
			)
		}
		await db2.execute(
			"UPDATE ean SET estimated_EAN_PER_KG = ? WHERE ean_id = ?",
			[getEanPerKg(data), ean_id],
		)
		await res.status(200).json({
			message: "Ean Details Added Successfully",
		})
	} catch (err) {
		return res.status(400).json({
			message: "Error Occured",
			error: err,
		})
	}
}

const createEan = async (req, res) => {
	const {
		ean_name_en,
		ean_name_th,
		ean_unit,
		ean_code,
		user,
		estimated_EAN_PER_HOUR,
		estimated_EAN_PER_KG,
	} = req.body

	try {
		const query =
			"INSERT INTO ean(ean_name_en, ean_name_th, ean_unit, ean_code, user, estimated_EAN_PER_HOUR, estimated_EAN_PER_KG) VALUES(?, ?, ?, ?, ?, ?, ?)"
		const [data] = await db2.execute(query, [
			ean_name_en || "",
			ean_name_th || "",
			ean_unit,
			ean_code,
			user,
			estimated_EAN_PER_HOUR,
			estimated_EAN_PER_KG,
		])

		res.status(200).send({
			success: true,
			message: "success",
			data: data.insertId,
		})
	} catch (err) {
		res.status(500).send({
			success: false,
			message: err,
		})
	}
}

const EditEan = async (req, res) => {
	const {
		ean_name_en,
		ean_name_th,
		ean_unit,
		ean_code,
		estimated_EAN_PER_HOUR,
		estimated_EAN_PER_KG,
	} = req.body
	try {
		await db2.query(
			`UPDATE ean SET ean_name_en = "${ean_name_en}", ean_name_th = "${ean_name_th}", ean_code = "${ean_code}", ean_unit = "${ean_unit}", estimated_EAN_PER_HOUR = "${estimated_EAN_PER_HOUR}", estimated_EAN_PER_KG = "${estimated_EAN_PER_KG}" WHERE ean_id = "${req.body.ean_id}"`,
		)
		res.status(200).send({
			success: true,
			message: "Updated Successfully",
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: error,
		})
	}
}

const createEanProducne = async (req, res) => {
	try {

		const { packing_common_id, ean_id, ean_quantity, unit_id, brand_id, number_of_staff, start_time, end_time } = req.body
     //  console.log(req.body);
		await db2.query(
			`UPDATE packing_common SET number_of_staff = "${number_of_staff}", start_time = "${start_time}", end_time = "${end_time}" WHERE packing_common_id = "${packing_common_id}"`,
		)
		await db2.execute(`CALL Insert_packing_ean(${packing_common_id}, ${ean_id}, ${ean_quantity}, ${unit_id}, ${brand_id})`)

		res.status(200).send({
			success: true,
			message: "Create Successfully"
		})

	} catch (error) {
		console.log(error.message);
		res.status(500).send({
			success: false,
			message: error.message,
		})
	}
}

const getEanDetailViews = async (req, res) => {
	try {

		const [result] = await db2.query(
			"SELECT * FROM packing_ean_view WHERE packing_common_id = ?",
			[req.body.packing_common_id],
		)

		res.status(200).json({
			message: "success",
			data: result,
		})
		
	} catch (error) {
		res.status(500).send({
			success: false,
			message: error,
		})
	}
}

const createEanPacking = async (req, res) => {
	try {

		const { packing_common_id } = req.body

		await db2.execute(`CALL New_Ean_Packing(${packing_common_id})`)

		res.status(200).send({
			success: true,
			message: "Create Successfully"
		})

	} catch (error) {
		res.status(500).send({
			success: false,
			message: error,
		})
	}
}

module.exports = {
	getEanDeatils,
	addEanDetails,
	updateEanDetails,
	EditEan,
	createEan,
	getEanDetailViews,
	createEanProducne,
	createEanPacking
}
