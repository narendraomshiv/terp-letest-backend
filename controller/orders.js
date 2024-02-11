const { db } = require("../db/db2")

const getOrders = async (req, res) => {
	try {
		const [data] = await db.query(
			/* sql */ `SELECT orders.*,
    consignee.consignee_name,
    locaiton.name AS location_name,
    freight.Liner AS Freight_liner,
    freight.journey_number AS Freight_journey_number,
    freight.bl AS Freight_bl,
    freight.Load_date AS Freight_load_date,
    freight.Load_time AS Freight_load_time,
    freight.Ship_date AS Freight_ship_date,
    freight.ETD AS Freight_etd,
    freight.Arrival_date AS Freight_arrival_date,
    freight.ETA AS Freight_eta,
    vendor.name AS supplier_name
FROM orders
INNER JOIN consignee ON  orders.consignee_id = consignee.consignee_id
INNER JOIN vendors AS vendor ON orders.Freight_provider_ = vendor.vendor_id
INNER JOIN setup_location AS locaiton ON orders.loading_location = locaiton.id
INNER JOIN order_freight_details AS freight ON orders.order_id = freight.order_id`,
		)
		res.status(200).json({ data })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const getOrdersDetails = async (req, res) => {
	const { id } = req.query
	try {
		const [data] = await db.query(
			"SELECT * FROM order_details_view WHERE order_id = ?",
			[id],
		)
		res.status(200).json({ data })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const createOrder = async (req, res) => {
	const { input, details } = req.body
	try {
		const [data] = await db.execute(
			/*sql*/ `INSERT INTO orders (order_id, Order_number, brand_id,
		Shipment_ref, quote_id, client_id, loading_location,
		consignee_id, destination_port_id, liner_id, from_port_,
		fx_id, fx_rate, Freight_provider_, Clearance_provider,
		Transportation_provider, mark_up, rebate, palletized,
		Chamber, load_date, created, updated,
		user, Status) VALUES
		(NULL, NULL, :brand_id,
		NULL, :quote_id, :client_id, :loading_location,
		:consignee_id, :destination_port_id, :liner_id, :from_port_,
		:fx_id, :fx_rate, :Freight_provider_, :Clearance_provider,
		:Transportation_provider, :mark_up, :rebate, :palletized,
		:Chamber, :load_date, :created, current_timestamp(),
		NULL, '0');`.trim(),
			{
				brand_id: input.brand_id || null,
				client_id: input.client_id || null,
				quote_id: input.quote_id || null,
				loading_location: input.loading_location || null,
				consignee_id: input.consignee_id || null,
				destination_port_id: input.destination_port_id || null,
				liner_id: input.liner_id || null,
				from_port_: input.from_port_ || null,
				fx_id: input.fx_id || null,
				fx_rate: input.fx_rate || 0,
				Freight_provider_: input.Freight_provider_ || null,
				Clearance_provider: input.Clearance_provider || null,
				Transportation_provider: input.Transportation_provider || null,
				mark_up: input.mark_up || 0,
				rebate: input.rebate || 0,
				palletized: input.palletized ? "ON" : "OFF",
				Chamber: input.Chamber ? "ON" : "OFF",
				load_date: input.load_date || null,
				order_id: input.order_id || null,
				created: input.created || null,
			},
		)
		for (const d of details) {
			if (!d.od_id) {
				const [i] = await db.query(
					`SET @p6='';CALL insert_order_details(${d.ITF || "null"}, ${
						d.itf_quantity || "null"
					}, ${d.itf_unit || "null"}, ${input.brand_id || "null"}, ${
						input.user || 1
					}, ${data.insertId || ""}, @p6); SELECT @p6 AS od_id`,
				)
			}
		}

		await db.execute(`CALL New_order_with_id(${data.insertId})`)

		res.status(200).json({ data })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const addOrderInput = async (req, res) => {
	const { input, details } = req.body
	try {
		const [isExist] = await db.execute(
			"SELECT * FROM orders WHERE order_id = ?",
			[input.order_id || null],
		)

		let data = null
		let query = ""
		const params = {
			brand_id: input.brand_id || null,
			client_id: input.client_id || null,
			quote_id: input.quote_id || null,
			loading_location: input.loading_location || null,
			consignee_id: input.consignee_id || null,
			destination_port_id: input.destination_port_id || null,
			liner_id: input.liner_id || null,
			from_port_: input.from_port_ || null,
			fx_id: input.fx_id || null,
			fx_rate: input.fx_rate || 0,
			Freight_provider_: input.Freight_provider_ || null,
			Clearance_provider: input.Clearance_provider || null,
			Transportation_provider: input.Transportation_provider || null,
			mark_up: input.mark_up || 0,
			rebate: input.rebate || 0,
			palletized: input.palletized ? "ON" : "OFF",
			Chamber: input.Chamber ? "ON" : "OFF",
			load_date: input.load_date || null,
			order_id: input.order_id || null,
			created: input.created || null,
			user: input.user || 6,
		}

		if (!isExist.length) {
			query = `INSERT INTO orders (order_id, Order_number, brand_id,
      Shipment_ref, quote_id, client_id, loading_location,
      consignee_id, destination_port_id, liner_id, from_port_,
      fx_id, fx_rate, Freight_provider_, Clearance_provider,
      Transportation_provider, mark_up, rebate, palletized,
      Chamber, load_date, created, updated,
      user, Status) VALUES
      (:order_id, NULL, :brand_id,
      NULL, :quote_id, :client_id, :loading_location,
      :consignee_id, :destination_port_id, :liner_id, :from_port_,
      :fx_id, :fx_rate, :Freight_provider_, :Clearance_provider,
      :Transportation_provider, :mark_up, :rebate, :palletized,
      :Chamber, :load_date, :created, current_timestamp(),
      :user, '0')`
		} else {
			query = `UPDATE orders SET
      brand_id = 								:brand_id,
      client_id = 							:client_id,
      loading_location = 				:loading_location,
      consignee_id = 						:consignee_id,
      destination_port_id = 		:destination_port_id,
      liner_id = 								:liner_id,
      from_port_ = 							:from_port_,
      fx_id = 									:fx_id,
      fx_rate = 								:fx_rate,
      Freight_provider_ = 			:Freight_provider_,
      Clearance_provider = 			:Clearance_provider,
      Transportation_provider = :Transportation_provider,
      mark_up = 								:mark_up,
      rebate = 									:rebate,
      palletized = 							:palletized,
      Chamber = 								:Chamber,
      load_date = 							:load_date,
      created = 								:created,
      updated =									current_timestamp()
      WHERE order_id = :order_id`.trim()
		}

		const [data2] = await db.execute(query, params)
		data = isExist.length ? { insertId: isExist[0].order_id } : data2
		let i
		if (!details.od_id) {
			const [rows] = await db.query(
				"SET @p6='';CALL insert_order_details(?, ?, ?, ?, ?, ?, @p6); SELECT @p6 AS od_id",
				[
					details.ITF || null,
					details.itf_quantity || null,
					details.itf_unit || null,
					details.brand_id || null,
					input.user || 6,
					data.insertId || null,
				],
			)
			i = rows
		} else {
			await db.execute(
				`UPDATE order_details SET
				ITF = :ITF,
				itf_quantity = :itf_quantity,
				itf_unit = :itf_unit,
				brand = :brand,
				adjusted_price = :adjusted_price WHERE od_id = :od_id`,
				{
					od_id: details.od_id || null,
					ITF: details.ITF || null,
					itf_quantity: details.itf_quantity || null,
					itf_unit: details.itf_unit || null,
					brand: details.brand_id,
					adjusted_price: details.adjusted_price || null,
				},
			)
			await db.execute("CALL order_details_Update(?)", [details.od_id])
			i = details.od_id
		}

		await db.execute("CALL New_order_with_id(?)", [
			data.insertId || input.order_id,
		])

		res.status(200).json({ data, i })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}
const updateOrder = async (req, res) => {
	const { input, details } = req.body
	try {
		const [data] = await db.execute(
			`UPDATE orders SET brand_id = :brand_id,
		client_id = :client_id, loading_location = :loading_location,
		consignee_id = :consignee_id, destination_port_id = :destination_port_id,
		liner_id = :liner_id, from_port_ = :from_port_,
		fx_id = :fx_id, fx_rate = :fx_rate,
		Freight_provider_ = :Freight_provider_, Clearance_provider = :Clearance_provider,
		Transportation_provider = :Transportation_provider, mark_up = :mark_up,
		rebate = :rebate, palletized = :palletized,
		Chamber = :Chamber, load_date = :load_date,
		updated = current_timestamp()
		WHERE orders.order_id = :order_id LIMIT 1`,
			{
				brand_id: input.brand_id || null,
				client_id: input.client_id || null,
				loading_location: input.loading_location || null,
				consignee_id: input.consignee_id || null,
				destination_port_id: input.destination_port_id || null,
				liner_id: input.liner_id || null,
				from_port_: input.from_port_ || null,
				fx_id: input.fx_id || null,
				fx_rate: input.fx_rate || 0,
				Freight_provider_: input.Freight_provider_ || null,
				Clearance_provider: input.Clearance_provider || null,
				Transportation_provider: input.Transportation_provider || null,
				mark_up: input.mark_up || 0,
				rebate: input.rebate || 0,
				palletized: input.palletized ? "ON" : "OFF",
				Chamber: input.Chamber ? "ON" : "OFF",
				load_date: input.load_date || null,
				order_id: input.order_id || null,
			},
		)
		for (const d of details) {
			if (!d.od_id) {
				const [i] = await db.query(
					`SET @p6='';CALL insert_order_details(${d.ITF || "null"}, ${
						d.itf_quantity || "null"
					}, ${d.itf_unit || "null"}, ${input.brand_id || "null"}, ${
						input.user || 1
					}, ${
						data.insertId || input.order_id || ""
					}, @p6); SELECT @p6 AS od_id`,
				)
			} else {
				await db.execute(
					`UPDATE order_details SET
					ITF = 					:ITF,
					itf_quantity = 	:itf_quantity,
					itf_unit = 			:itf_unit,
					adjusted_price =		:adjusted_price
					WHERE order_details.od_id = :od_id`,
					{
						od_id: d.od_id || null,
						ITF: d.ITF || null,
						Order_id: input.order_id || null,
						itf_quantity: d.itf_quantity || null,
						itf_unit: d.itf_unit || null,
						user: input.user || null,
						adjusted_price: details.adjusted_price || null,
					},
				)
				await db.execute(`CALL order_details_Update(${d.od_id})`)
			}
		}

		await db.execute(
			`CALL New_order_with_id(${data.insertId || input.order_id})`,
		)
		res.status(200).json({ data })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const deleteOrderDetails = async (req, res) => {
	const { id } = req.body
	try {
		const data = await db.execute("DELETE FROM order_details WHERE od_id = ?", [
			id,
		])
		await db.execute("DELETE FROM order_details_input WHERE od_id = ?", [id])
		res.status(200).json({ data })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const newCalculateOrder = async (req, res) => {
	const { input, details } = req.body
	const timing = []
	try {
		const [data] = await db.execute(
			`INSERT INTO orders (order_id, Order_number, brand_id,
		Shipment_ref, quote_id, client_id, loading_location,
		consignee_id, destination_port_id, liner_id, from_port_,
		fx_id, fx_rate, Freight_provider_, Clearance_provider,
		Transportation_provider, mark_up, rebate, palletized,
		Chamber, load_date, created, updated,
		user, Status) VALUES
		(:order_id, NULL, :brand_id,
		NULL, :quote_id, :client_id, :loading_location,
		:consignee_id, :destination_port_id, :liner_id, :from_port_,
		:fx_id, :fx_rate, :Freight_provider_, :Clearance_provider,
		:Transportation_provider, :mark_up, :rebate, :palletized,
		:Chamber, :load_date, :created, current_timestamp(),
		:user, '0')
		ON DUPLICATE KEY UPDATE
		brand_id = 								:brand_id,
		client_id = 							:client_id,
		loading_location = 				:loading_location,
		consignee_id = 						:consignee_id,
		destination_port_id = 		:destination_port_id,
		liner_id = 								:liner_id,
		from_port_ = 							:from_port_,
		fx_id = 									:fx_id,
		fx_rate = 								:fx_rate,
		Freight_provider_ = 			:Freight_provider_,
		Clearance_provider = 			:Clearance_provider,
		Transportation_provider = :Transportation_provider,
		mark_up = 								:mark_up,
		rebate = 									:rebate,
		palletized = 							:palletized,
		Chamber = 								:Chamber,
		load_date = 							:load_date,
		created = 								:created,
		updated =									current_timestamp()`.trim(),
			{
				brand_id: input.brand_id || null,
				client_id: input.client_id || null,
				quote_id: input.quote_id || null,
				loading_location: input.loading_location || null,
				consignee_id: input.consignee_id || null,
				destination_port_id: input.destination_port_id || null,
				liner_id: input.liner_id || null,
				from_port_: input.from_port_ || null,
				fx_id: input.fx_id || null,
				fx_rate: input.fx_rate || 0,
				Freight_provider_: input.Freight_provider_ || null,
				Clearance_provider: input.Clearance_provider || null,
				Transportation_provider: input.Transportation_provider || null,
				mark_up: input.mark_up || 0,
				rebate: input.rebate || 0,
				palletized: input.palletized ? "ON" : "OFF",
				Chamber: input.Chamber ? "ON" : "OFF",
				load_date: input.load_date || null,
				order_id: input.order_id || null,
				created: input.created || null,
				user: input.user || null,
			},
		)
		const insertId = input.order_id || data.insertId
		const detialsId = []
		details.map((v) => {
			detialsId.push({
				data: v,
				insertId: v.od_id || null,
			})
		})
		for (const [idx, d] of details
			.filter((v) => v.is_changed || !v.od_id)
			.entries()) {
			if (!d.od_id) {
				const [i] = await db.query(
					`SET @p6='';CALL insert_order_details(${d.ITF || "null"}, ${
						d.itf_quantity || "null"
					}, ${d.itf_unit || "null"}, ${input.brand_id || "null"}, ${
						input.user || 1
					}, ${insertId || ""}, @p6); SELECT @p6 AS od_id`,
				)
				detialsId[idx].insertId = i[2][0].od_id || d.od_id
			} else {
				const [i] = await db.execute(
					`UPDATE order_details SET
					ITF = 					:ITF,
					itf_quantity = 	:itf_quantity,
					itf_unit = 			:itf_unit,
					adjusted_price =		:adjusted_price WHERE order_details.od_id = :od_id`,
					{
						od_id: d.od_id || null,
						ITF: d.ITF || null,
						Order_id: insertId || null,
						itf_quantity: d.itf_quantity || null,
						adjusted_price: d.adjusted_price ?? null,
						itf_unit: d.itf_unit || null,
						user: input.user || null,
					},
				)
				detialsId[idx].insertId = d.od_id
				await db.execute("CALL order_details_Update(?)", [d.od_id])
			}
		}
		await db.execute(`CALL New_order_with_id(${insertId})`)
		res.status(200).json({ data, calculated: detialsId, timing })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const calculateOrder = async (req, res) => {
	const { details, input } = req.body

	try {
		const [data] = await db.execute(
			/*sql*/ `INSERT INTO orders (order_id, Order_number, brand_id,
		Shipment_ref, quote_id, client_id, loading_location,
		consignee_id, destination_port_id, liner_id, from_port_,
		fx_id, fx_rate, Freight_provider_, Clearance_provider,
		Transportation_provider, mark_up, rebate, palletized,
		Chamber, load_date, created, updated,
		user, Status) VALUES
		(NULL, NULL, ?,
		NULL, ?, ?, ?,
		?, ?, ?, ?,
		?, ?, ?, ?,
		?, ?, ?, ?,
		?, ?, ?, current_timestamp(),
		NULL, '0')`,
			[
				input.brand_id,
				input.quote_id,
				input.client_id,
				input.loading_location,
				input.consignee_id,
				input.destination_port_id,
				input.liner_id,
				input.from_port_,
				input.fx_id,
				input.fx_rate,
				input.Freight_provider_,
				input.Clearance_provider,
				input.Transportation_provider,
				input.mark_up || 0,
				input.rebate || 0,
				input.palletized ? "ON" : "OFF",
				input.Chamber ? "ON" : "OFF",
				input.load_date,
				input.created,
			],
		)
		const detialsId = []
		for (const d of details) {
			const [i] = await db.execute(
				"INSERT INTO `order_details_input` (ITF, Order_id, itf_quantity, itf_unit) VALUES (?, ?, ?, ?)",
				[d.ITF, data.insertId, d.itf_quantity, d.itf_unit],
			)
			detialsId.push({
				data: {},
				qdi: i.insertId,
			})
		}
		if (data.insertId) {
			await db.execute("CALL New_order_with_id(?)", [data.insertId])
		}
		Promise.all(
			detialsId.map(async (d, i) => {
				const [detailsResult] = await db.query(
					"SELECT * FROM `order_details` WHERE `od_id` = ? LIMIT 1",
					[d.qdi],
				)
				const [cost] = await db.query(
					"SELECT * FROM `order_costs` WHERE `od_id` = ? LIMIT 1",
					[d.qdi],
				)
				const [qodbox] = await db.query(
					"SELECT odbox(?) AS odbox, od_nw(?) AS od_nw;",
					[d.qdi, d.qdi],
				)
				detialsId[i].data = {
					...detailsResult[0],
					Number_of_boxes: qodbox[0].odbox || detailsResult[0].Number_of_boxes,
					net_weight: qodbox[0].od_nw || detailsResult[0].net_weight,
					profit_percentage: cost[0].profit_percentage,
				}
			}),
		)
		await db.execute(
			"DELETE FROM `order_financials` WHERE `Order_id` = ? LIMIT 1",
			[0],
		)
		await db.execute("DELETE FROM `order_details_input` WHERE Order_id = ?", [
			data.insertId,
		])
		await db.execute("DELETE FROM `orders` WHERE order_id = ?", [data.insertId])
		res.status(200).json({ message: "Success", data: detialsId })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const doOrderPacking = async (req, res) => {
	const data = req.body
	try {
		await db.execute("CALL New_order_packing(?, ?, ?, ?, ?, ?)", [
			data.od_id,
			data.net_weight,
			data.itf_quantity,
			data.Number_of_boxes,
			data.buns,
			data.adjusted_gw_od,
		])
		return res.status(200).json({ message: "Success" })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const getOrderSummary = async (req, res) => {
	const { quote_id } = req.query
	try {
		const [data] = await db.execute(
			"SELECT * FROM `order_summery` WHERE `order_id` = ?",
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

const deleteOrder = async (req, res) => {
	const { id } = req.body
	try {
		const [data] = await db.query("SELECT * FROM orders WHERE order_id = ?", [
			id,
		])
		if (!data.length)
			return res.status(400).json({ message: "Order not found" })
		if ((+data[0].Status || 0) != 0)
			return res.status(400).json({ message: "Order already processed" })
		const [r] = await db.execute("DELETE FROM orders WHERE order_id = ?", [id])
		if ((r.affectedRows || 0) > 0) {
			await db.execute("DELETE FROM order_financials WHERE Order_id = ?", [id])
			await db.execute("DELETE FROM order_details WHERE order_id = ?", [id])
		}
		res.status(200).json({ message: "success", data: r })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const updateOrderFreight = async (req, res) => {
	const {
		order_id,
		Liner,
		bl,
		Load_date,
		Load_time,
		Ship_date,
		ETD,
		Arrival_date,
		journey_number,
		ETA,
	} = req.body
	if (!order_id)
		return res.status(400).json({ message: "Order id is required" })
	try {
		const [data] = await db.query(
			"SELECT order_id FROM order_freight_details WHERE order_id = ?",
			[order_id],
		)
		if (data.length > 0) {
			await db.execute(
				`UPDATE order_freight_details SET
				Liner = ?,
				bl = ?,
				Load_date = ?,
				Load_time = ?,
				Ship_date = ?,
				ETD = ?,
				Arrival_date = ?,
				journey_number = ?,
				ETA = ? WHERE order_id = ?`,
				[
					Liner,
					bl,
					Load_date,
					Load_time,
					Ship_date,
					ETD,
					Arrival_date,
					journey_number,
					ETA,
					order_id,
				],
			)
		} else {
			await db.execute(
				"INSERT INTO order_freight_details (order_id, Liner, bl, Load_date, Load_time, Ship_date, ETD, Arrival_date, ETA,journey_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
				[
					order_id,
					Liner,
					bl,
					Load_date,
					Load_time,
					Ship_date,
					ETD,
					Arrival_date,
					ETA,
					journey_number,
				],
			)
		}
		res.status(200).json({ message: "success" })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

const aslWastage = async (req, res) => {
	const { sortingid, adjustqty, crates } = req.body
	try {
		const [data] = await db.execute("CALL asl_wastage(?,?,?)", [
			sortingid,
			adjustqty,
			crates,
		])
		res.status(200).json({ message: "success", data })
	} catch (e) {
		res.status(500).json({ message: "Internal server error", error: e })
	}
}

module.exports = {
	getOrders,
	createOrder,
	updateOrder,
	getOrdersDetails,
	deleteOrderDetails,
	calculateOrder,
	doOrderPacking,
	addOrderInput,
	newCalculateOrder,
	getOrderSummary,
	deleteOrder,
	updateOrderFreight,
	aslWastage,
}
