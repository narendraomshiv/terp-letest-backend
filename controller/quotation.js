const { db: db2 } = require("../db/db2")

const getAllQuotation = async (req, res) => {
	try {
		/* SELECT quotations.*, clients.client_name AS client_name, setup_location.name AS location_name
		FROM quotations
		JOIN clients ON quotations.client_id = clients.client_id
		JOIN setup_location ON quotations.loading_location = setup_location.id; */
		const [data] = await db2.query(
			`SELECT * FROM quotations`,
		)
		res.status(200).json({
			message: "All Quotation",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const addQuotation = async (req, res) => {
	const quotationData = req.body
	try {
		const [data] = await db2.execute(
			/*sql*/ `INSERT INTO quotations (brand_id, client_id, loading_location, Freight_provider_,
	 liner_id, from_port_, destination_port_id, Clearance_provider, Transportation_provider, consignee_id, fx_id,
	 fx_rate, mark_up, rebate, palletized, Chamber, load_date, created, updated, user, Status)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), '', '1')`,
			[
				quotationData.brand_id,
				quotationData.client_id,
				quotationData.loading_location,
				quotationData.Freight_provider_,
				quotationData.liner_id,
				quotationData.from_port_,
				quotationData.destination_port_id,
				quotationData.Clearance_provider,
				quotationData.Transportation_provider,
				quotationData.consignee_id,
				quotationData.fx_id,
				quotationData.fx_rate,
				quotationData.mark_up || 0,
				quotationData.rebate || 0,
				quotationData.palletized ? "YES" : "NO",
				quotationData.Chamber ? "YES" : "NO",
				quotationData.load_date,
				quotationData.created,
			],
		)
		res.status(200).json({
			message: "Quotation Added",
			data: data.insertId,
		})
	} catch (err) {
		res.status(400).json({
			message: "Error Occured",
			error: err,
		})
	}
}

const addQuotationDetails = async (req, res) => {
	const { quotation_id, data } = req.body
	const o = []
	try {
		for (const d of data) {
			const [i] = await db2.execute(
				"INSERT INTO quotation_details_inputs (quote_id, ITF, itf_quantity, itf_unit) VALUES (?, ?, ?, ?);",
				[quotation_id, d.ITF, d.itf_quantity, d.itf_unit],
			)
			o.push(i.insertId)
		}
		await db2.execute("CALL New_quotation(?)", [quotation_id])
		let i = 0
		for (const v of o) {
			await db2.execute(
				"UPDATE quotation_details SET adjusted_price = ? WHERE qod_id = ?",
				[data[i].adjusted_price || null, v],
			)
			i++
		}
		res.status(200).json({
			message: "Quotation Details Added",
		})
	} catch (err) {
		res.status(400).json({
			message: "Error Occured",
			error: err,
		})
	}
}

const calculateQuotation = async (req, res) => {
	const { quotationData, inputData } = req.body
	try {
		const [{ insertId: quotation_id }] = await db2.execute(
			`INSERT INTO quotations (brand_id, client_id, loading_location, Freight_provider_,
	 liner_id, from_port_, destination_port_id, Clearance_provider, Transportation_provider, consignee_id, fx_id,
	 fx_rate, mark_up, rebate, palletized, Chamber, load_date, created, updated, user, Status)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), '', '1')`,
			[
				quotationData.brand_id,
				quotationData.client_id,
				quotationData.loading_location,
				quotationData.Freight_provider_,
				quotationData.liner_id,
				quotationData.from_port_,
				quotationData.destination_port_id,
				quotationData.Clearance_provider,
				quotationData.Transportation_provider,
				quotationData.consignee_id,
				quotationData.fx_id,
				quotationData.fx_rate,
				quotationData.mark_up || 0,
				quotationData.rebate || 0,
				quotationData.palletized ? "YES" : "NO",
				quotationData.Chamber ? "YES" : "NO",
				quotationData.load_date,
				quotationData.created,
			],
		)
		const resultData = []
		for (const d of inputData) {
			const [{ insertId: qdi }] = await db2.execute(
				"INSERT INTO quotation_details_inputs (quote_id, ITF, itf_quantity, itf_unit) VALUES (?, ?, ?, ?);",
				[quotation_id, d.ITF, d.itf_quantity, d.itf_unit],
			)
			resultData.push({
				data: {},
				qdi: qdi,
			})
		}

		await db2.execute("CALL New_quotation(?)", [quotation_id])
		const [summary] = await db2.query(
			"SELECT * FROM quotation_summery WHERE quote_id = ? LIMIT 1",
			[quotation_id],
		)
		Promise.all(
			resultData.map(async (d, i) => {
				const [detailsResult] = await db2.query(
					"SELECT * FROM quotation_details WHERE qod_id = ? LIMIT 1",
					[d.qdi],
				)
				const [cost] = await db2.query(
					"SELECT * FROM quotation_cost WHERE qod_id = ? LIMIT 1",
					[d.qdi],
				)
				const [qodbox] = await db2.query(
					"SELECT qodbox(?) AS qodbox, qod_nw(?) AS qod_nw;",
					[d.qdi, d.qdi],
				)
				resultData[i].data = {
					...detailsResult[0],
					Number_of_boxes: qodbox[0].qodbox || detailsResult[0].Number_of_boxes,
					net_weight: qodbox[0].qod_nw || detailsResult[0].net_weight,
					profit_percentage: cost[0].profit_percentage,
				}
			}),
		)
		await db2.execute(
			"DELETE FROM quotation_financials WHERE qo = ? LIMIT 1",
			[0],
		)
		await db2.execute("DELETE FROM quotation_financials WHERE qo = ? LIMIT 1", [
			quotation_id,
		])
		await db2.execute("DELETE FROM quotation_details WHERE quote_id = ?", [
			quotation_id,
		])
		await db2.execute(
			"DELETE FROM quotation_details_inputs WHERE quote_id = ?",
			[quotation_id],
		)
		await db2.execute("DELETE FROM `quotation` WHERE `quote_id` = ?", [
			quotation_id,
		])
		return res.status(200).json({
			message: "Calculated",
			data: resultData,
			summary: summary[0],
		})
	} catch (e) {
		return res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const getQuotationDetials = async (req, res) => {
	const { quote_id } = req.query
	try {
		const [data] = await db2.query(
			`SELECT a.*, b.profit_percentage
			FROM quotation_details as a
			INNER JOIN quotation_cost as b
			ON a.qod_id = b.qod_id
			WHERE a.quote_id = ?
			`,
			[quote_id],
		)
		res.status(200).json({
			message: "Quotation Details",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const getQuotationSummary = async (req, res) => {
	const { quote_id } = req.query
	try {
		const [data] = await db2.query(
			"SELECT * FROM `quotation_summery` WHERE `quote_id` = ?",
			[quote_id],
		)
		res.status(200).json({
			message: "Quotation Summary",
			data: data[0],
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const deleteQuotationDetials = async (req, res) => {
	const { qod_id } = req.query
	try {
		await db2.execute(
			"DELETE FROM quotation_details_inputs WHERE qod = ? LIMIT 1",
			[qod_id],
		)
		await db2.execute(
			"DELETE FROM quotation_details WHERE qod_id = ? LIMIT 1",
			[qod_id],
		)
		res.status(200).json({
			message: "Quotation Details Deleted",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const updateQuotation = async (req, res) => {
	const quotationData = req.body
	try {
		await db2.execute(
			`UPDATE quotation SET brand_id = ?, client_id = ?, loading_location = ?, Freight_provider_ = ?,
	 liner_id = ?, from_port_ = ?, destination_port_id = ?, Clearance_provider = ?, Transportation_provider = ?, consignee_id = ?, fx_id = ?,
	 fx_rate = ?, mark_up = ?, rebate = ?, palletized = ?, Chamber = ?, load_date = ?, created = ?, updated = current_timestamp(), user = ?, Status = '1'
		 WHERE quote_id = ?`,
			[
				quotationData.brand_id,
				quotationData.client_id,
				quotationData.loading_location,
				quotationData.Freight_provider_,
				quotationData.liner_id,
				quotationData.from_port_,
				quotationData.destination_port_id,
				quotationData.Clearance_provider,
				quotationData.Transportation_provider,
				quotationData.consignee_id,
				quotationData.fx_id,
				quotationData.fx_rate,
				quotationData.mark_up || 0,
				quotationData.rebate || 0,
				quotationData.palletized ? "YES" : "NO",
				quotationData.Chamber ? "YES" : "NO",
				quotationData.load_date,
				quotationData.created,
				quotationData.user,
				quotationData.quote_id,
			],
		)
		await db2.execute(`CALL New_quotation(${quotationData.quote_id})`, [])
		res.status(200).json({
			message: "Quotation Updated",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}
const updateQuotationDetails = async (req, res) => {
	const { data } = req.body
	try {
		for (const d of data) {
			await db2.execute(
				"UPDATE quotation_details_inputs SET ITF = ?, itf_quantity = ?, itf_unit = ? WHERE qod = ?",
				[d.ITF, d.itf_quantity, d.itf_unit, d.qod_id],
			)
			await db2.execute(
				"UPDATE quotation_details SET adjusted_price = ? WHERE qod_id = ?",
				[d.adjusted_price || null, d.qod_id],
			)
		}

		res.status(200).json({
			message: "Quotation Details Updated",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}
const confirmQuotation = async (req, res) => {
	const { quote_id } = req.body
	try {
		await db2.execute(`CALL Quotation_Confirmation(${quote_id})`, [])
		res.status(200).json({
			message: "Quotation Confirmed",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}
module.exports = {
	getAllQuotation,
	addQuotation,
	addQuotationDetails,
	calculateQuotation,
	getQuotationDetials,
	getQuotationSummary,
	deleteQuotationDetials,
	updateQuotationDetails,
	updateQuotation,
	confirmQuotation,
}
