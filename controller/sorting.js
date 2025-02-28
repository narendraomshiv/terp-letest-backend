const { db: db2 } = require("../db/db2")
const getViewToSort = async (req, res) => {
	try {
		const [result] = await db2.query("SELECT * FROM to_sort")
		res.status(200).json({
			message: "All Wage",
			data: result,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const getSorting = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * FROM sorting")
		res.status(200).json({
			message: "All Wage",
			data: data,
		})
	} catch (err) {
		res.status(400).json({
			message: "Error Occured",
			error: err,
		})
	}
}
const addsorting = async (req, res) => {
	const {
		receiving_id,
		sorting_good,
		sorted_crates,
		sorting_notes,
		blue_crates,
	} = req.body
	try {
		const [data] = await db2.execute("CALL New_Sorting(?,?,?,?,?)", [
			receiving_id,
			sorting_good,
			sorted_crates,
			sorting_notes,
			blue_crates,
		])
		res.status(200).json({
			message: "Done",
			data: data
		})
	} catch (err) {
		res.status(400).json({
			error: err,
		})
	}
}

const revertSorting = async (req, res) => {
	const { sorting_id } = req.body
	console.log(sorting_id);
	try {
		const [result] = await db2.query(
			"SELECT a.*, b.rcvd_item from sorting as a INNER JOIN receiving as b on a.receiving_id = b.receiving_id WHERE a.sorting_id = ? LIMIT 1;",
			[sorting_id],
		)
		const { rcvd_item, pod_code } = result[0]
		await db2.query("DELETE FROM sorting WHERE sorting_id = ? LIMIT 1", [
			sorting_id,
		])
		await db2.query(
			"DELETE FROM inventory WHERE pod_code = ? AND pod_item = ? AND transaction_type = 4",
			[pod_code, rcvd_item],
		)
		res.status(200).json({
			message: "All Receving",
			data: result,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

// new_added

const restoreEanPacking = async (req, res) => {
	try {

		const { sorting_id } = req.body
		//console.log(sorting_id);
		await db2.execute(`CALL restore_sorting(${sorting_id})`)

		res.status(200).send({
			success: true,
			message: "Restore Successfully"
		})

	} catch (error) {
		res.status(500).send({
			success: false,
			message: error
		})
	}
}


const restoreSorting = async (req, res) => {
	try {

		const { receiving_id } = req.body
		//console.log(sorting_id);
		await db2.execute(`CALL restore_receiving(${receiving_id})`)

		res.status(200).send({
			success: true,
			message: "Restore Successfully"
		})

	} catch (error) {
		res.status(500).send({
			success: false,
			message: error
		})
	}
}


const restorePackingCommon= async(req, res)=>{
	try {

		const { packingCommonid } = req.body
		//console.log(sorting_id);
		await db2.execute(`CALL restore_packing_common(${packingCommonid})`)

		res.status(200).send({
			success: true,
			message: "Restore Successfully"
		})

	} catch (error) {
		res.status(500).send({
			success: false,
			message: error
		})
	}
}
//restore_packing_common

// 	dropdown_status

module.exports = { getViewToSort, addsorting, getSorting, revertSorting, restoreEanPacking, restoreSorting, restorePackingCommon }
