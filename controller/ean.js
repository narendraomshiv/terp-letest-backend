const { db } = require("../db/db2")

const getAdjustEanStock = async (req, res) => {
	try {
		const [data] = await db.query("SELECT * FROM `adjust_ean_stock`")
		res.status(200).json({
			message: "Adjust Ean Stock",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const getAdjustEanStockById = async (req, res) => {
	try {
		const [data] = await db.query(
			`SELECT
			ean.ean_id,
			ean.ean_name_en
			FROM packing_ean,ean_details,ean
			WHERE ean_details.ean_id=ean.ean_id
			AND ean_details.detail_type=3
			AND ean_details.item_id= (case when packing_ean.Produce_id=71 then (71 and 73) else packing_ean.Produce_id end)
			AND packing_ean.packing_ean_id = ?`,
			[req.query.id],
		)
		res.status(200).json({
			message: "Adjust Ean Stock",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const doRepackEan = async (req, res) => {
	const {
		packing_ean_id,
		name,
		oldqty,
		start_time,
		end_time,
		number_of_staff,
		details,
	} = req.body
	try {
		for (const [key, value] of Object.entries(details)) {
			const [data] = await db.execute("CALL ean_repack(?,?,?,?,?,?,?,?,?)", [
				packing_ean_id,
				oldqty,
				value?.eanID,
				value?.quantity,
				value?.unit,
				value?.brand,
				number_of_staff,
				start_time,
				end_time,
			])
		}
		res.status(200).json({
			message: "Adjust Ean Stock",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

module.exports = {
	getAdjustEanStock,
	getAdjustEanStockById,
	doRepackEan,
}
