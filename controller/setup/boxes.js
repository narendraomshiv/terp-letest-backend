const { db: db2 } = require("../../db/db2")
const getBoxId = require("../../function/getBoxID")

const addBoxes = async (req, res) => {
	try {
		const [data] = await db2.execute(
			"INSERT INTO setup_box (box_name, box_width, box_length, box_height, box_weight, box_pallet, box_cbm, box_mlw) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			[
				req.body.box_name,
				req.body.box_width,
				req.body.box_length,
				req.body.box_height,
				req.body.box_weight,
				req.body.box_pallet,
				req.body.box_cbm,
				req.body.box_mlw,
			],
		)
		await db2.execute(
			"UPDATE setup_box SET Inventory_code = ? WHERE box_id = ?",
			[getBoxId(data.insertId, ""), data.insertId],
		)
		res.status(200).send({
			success: true,
			message: "Box Added Successfully",
		})
	} catch (error) {
		res.status(500).send({
			success: false,
			error: error,
			message: "error has occurred",
		})
	}
}

const editBoxes = async (req, res) => {
	const {
		box_name: boxName,
		box_width: boxWidth,
		box_length: boxLength,
		box_height: boxHeight,
		box_weight: boxWeight,
		box_pallet: boxPallet,
		box_cbm: boxCbm,
		box_mlw: boxMlw,
		box_id: boxId,
	} = req.body
	try {
		const data = await db2.execute(
			"UPDATE setup_box SET box_name = ?, box_width = ?, box_length = ?, box_height = ?, box_weight = ?, box_pallet = ?, box_cbm = ?, box_mlw = ?, Inventory_code=?, updated = now() WHERE box_id = ?",
			[
				boxName,
				boxWidth,
				boxLength,
				boxHeight,
				boxWeight,
				boxPallet,
				boxCbm,
				boxMlw,
				getBoxId(boxId, ""),
				boxId,
			],
		)
		res.status(200).send({
			success: true,
			message: "Box Updated Successfully",
		})
	} catch (e) {
		res.status(400).send({
			success: false,
			message: "Please Provide Box Id",
		})
		return
	}
}

const getAllBoxes = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * FROM setup_box")
		res.status(200).send({
			success: true,
			message: "Getting Box Data Successfully",
			data: data,
		})
	} catch (error) {
		res.status(500).send({
			success: false,
			message: "error has occurred",
			error: error,
		})
	}
}

module.exports = {
	addBoxes,
	editBoxes,
	getAllBoxes,
}
