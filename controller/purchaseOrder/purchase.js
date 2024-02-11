const db = require("../../db/dbConnection")
const { db: db2 } = require("../../db/db2")

const addPurchageOrder = (req, resp) => {
	const {
		po_id,
		pod_code,
		accounting_id,
		pod_type_id,
		pod_item,
		pod_quantity,
		unit_count_id,
		pod_price,
		pod_vat,
		pod_wht_id,
		pod_line_total,
		pod_crate,
		pod_status,
		confirm,
		confirm_by,
		inventory,
		inventory_entry,
		vendor_id,
		po_code,
	} = req.body

	if (po_id == "" || !po_id) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Po_Id",
		})
		return
	}

	if (pod_type_id == "" || !pod_type_id) {
		resp.status(400).status(400).send({
			success: false,
			message: "Please Provide Pod Type Id",
		})
		return
	}

	if (pod_item == "" || !pod_item) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Pod Item",
		})
		return
	}

	if (pod_quantity == "" || !pod_quantity) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Pod Quantity",
		})
		return
	}

	if (pod_quantity == "" || !pod_quantity) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Pod Quantity",
		})
		return
	}

	if (unit_count_id == "" || !unit_count_id) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Unit Count Id",
		})
		return
	}

	if (pod_price == "" || !pod_price) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Pod Price",
		})
		return
	}

	if (pod_code == "" || !pod_code) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Pod Code",
		})
		return
	}

	db.query(
		`SELECT vendor_id FROM vendors WHERE vendor_id = "${vendor_id}"`,
		(error, data) => {
			if (error) {
				resp.status(500).send({
					success: false,
					message: error,
				})
				return
			}

			if (data.length === 0) {
				resp.status(200).send({
					success: false,
					message: "Vendor Id Does Not Exist",
				})
				return
			}
			db.query(
				`INSERT INTO purchase_order(vendor_id, po_code) VALUES('${vendor_id}', '${po_code}')`,
				(error, data) => {
					if (error) {
						resp.status(500).send({
							success: false,
							message: error,
						})
						return
					}
					db.query(
						`INSERT INTO purchase_order_details (po_id, pod_code, accounting_id, pod_type_id, pod_item, pod_quantity, unit_count_id, pod_price, pod_vat, pod_wht_id ) VALUES('${po_id}', '${pod_code}', '${accounting_id}', '${pod_type_id}', '${pod_item}', '${pod_quantity}', '${unit_count_id}', '${pod_price}', '${pod_vat}', '${pod_wht_id}')`,
						(insertErr, insertResp) => {
							if (insertErr) {
								resp.status(500).send({
									success: false,
									message: insertErr,
								})
								return
							}
							resp.status(200).send({
								success: true,
								message: "Purchase Order Successfully",
							})
							return
						},
					)
				},
			)
		},
	)
}

const newAddPurchaseOrder = async (req, resp) => {
	const { vendor_id, created, supplier_invoice_number, supplier_invoice_date } =
		req.body
	try {
		await db2.execute("CALL New_Purchase_order(?, ?)", [vendor_id, created])
		const [result] = await db2.query("SELECT LAST_INSERT_ID() as po_id;")
		await db2.execute(
			"UPDATE purchase_order SET supplier_invoice_number = ?, supplier_invoice_date = ?, created=? WHERE po_id = ?",
			[
				supplier_invoice_number ? `${supplier_invoice_number}` : null,
				supplier_invoice_date
					? `${new Date(supplier_invoice_date).toISOString().slice(0, 10)}`
					: null,
				created,
				result[0].po_id,
			],
		)
		resp
			.status(200)
			.json({ success: true, message: "Success", po_id: result[0].po_id })
	} catch (e) {
		res.status(500).json({ message: "Error has occured", error: e })
	}
}

const getPurchaseOrder = (request, response) => {
	db.query("SELECT * FROM  purchase_order_details", (error, data) => {
		if (error) {
			response.status(500).send({
				success: false,
				message: error,
			})
			return
		}

		if (data.length === 0) {
			response.status(200).send({
				success: true,
				message: "No Data Found",
			})
			return
		}
		response.status(200).send({
			success: true,
			message: "Getting Data Successfully",
			data: data,
		})
		return
	})
}

const getNewPurchaseOrder = (request, response) => {
	db.query(
		`SELECT a.*, b.name AS vendor_name,
		DATE_FORMAT(a.created, '%Y-%m-%d') AS created,
		DATE_FORMAT(a.supplier_invoice_date, '%Y-%m-%d') AS supplier_invoice_date, s.status,
		ROUND(SUM((pod.pod_quantity * pod.pod_price * (pod.pod_vat / 100)) + (pod.pod_quantity * pod.pod_price)),2) AS total_with_vat
		FROM purchase_order AS a
		INNER JOIN vendors AS b ON a.vendor_id = b.vendor_id
		LEFT JOIN purchase_order_details AS pod ON a.po_id = pod.po_id
		INNER JOIN dropdown_status as s ON a.po_status = s.status_id
		GROUP BY a.po_id;`,
		(error, data) => {
			if (error) {
				response.status(500).send({
					success: false,
					message: error,
				})
				return
			}

			if (data.length === 0) {
				response.status(200).send({
					success: true,
					message: "No Data Found",
				})
				return
			}
			response.status(200).send({
				success: true,
				message: "Getting Data Successfully",
				data: data,
			})
			return
		},
	)
}

const updatePurchaseOrder = (request, response) => {
	const {
		pod_id,
		po_id,
		pod_code,
		accounting_id,
		pod_type_id,
		pod_item,
		pod_quantity,
		unit_count_id,
		pod_price,
		pod_vat,
		pod_wht_id,
		pod_line_total,
		pod_crate,
		pod_status,
		confirm,
		confirm_by,
		inventory,
		inventory_entry,
		vendor_id,
		po_code,
	} = request.body

	if (pod_id == "" || !pod_id) {
		response.status(400).send({
			success: false,
			message: "Please Provide Pod Id",
		})
		return
	}

	db.query(
		`SELECT pod_id FROM purchase_order_details WHERE pod_id = "${pod_id}"`,
		(error, data) => {
			if (error) {
				response.status(400).send({
					success: false,
					message: error,
				})
				return
			}

			if (data.length === 0) {
				response.status(200).send({
					success: false,
					message: "Pod Id Does Not Exist",
				})
				return
			}
			db.query(
				`UPDATE purchase_order_details SET pod_item = "${pod_item}", pod_quantity = "${pod_quantity}", unit_count_id = "${unit_count_id}", pod_price = "${pod_price}", pod_vat = "${pod_vat}" WHERE pod_id = "${pod_id}"`,
				(error, data) => {
					if (error) {
						response.status(500).send({
							success: false,
							message: error,
						})
						return
					}
					response.status(200).send({
						success: true,
						message: "Purchase Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const newUpdatePurchaseOrder = (req, res) => {
	const {
		po_id,
		vendor_id,
		created,
		supplier_invoice_number,
		supplier_invoice_date,
	} = req.body
	const sql = `UPDATE purchase_order SET vendor_id = '${vendor_id}', created = '${created}', supplier_invoice_number = ${
		supplier_invoice_number || "NULL"
	}, supplier_invoice_date = '${
		supplier_invoice_date || "NULL"
	}' WHERE po_id = '${po_id}'`
	db.query(sql, (err, result) => {
		if (err) {
			return res
				.status(500)
				.json({ success: false, message: "Internal Server Error" })
		}
		return res.status(200).json({ success: true, message: "Success" })
	})
}

const purchaseOrderDetails = (req, res) => {
	const podId = req.body.pod_id

	if (podId == "" || !podId) {
		res.status(400).send({
			success: false,
			message: "Please Provide Pod Id",
		})
		return
	}

	db.query(
		`SELECT pod_id FROM purchase_order_details WHERE pod_id = "${podId}"`,
		(error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return
			}

			if (data.length === 0) {
				res.status(200).send({
					success: false,
					message: "Pod Id Does Not Exist",
				})
				return
			}
			db.query(
				`SELECT * FROM purchase_order_details WHERE pod_id = "${podId}"`,
				(error, data) => {
					if (error) {
						res.status(500).send({
							success: false,
							message: error,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Getting Data Successfully",
						purchaseOrder: data[0],
					})
					return
				},
			)
		},
	)
}

const addPurchaseOrderDetails = (req, res) => {
	const { data, po_id } = req.body
	for (const v of data) {
		const {
			pod_type_id,
			unit_count_id,
			pod_item,
			pod_quantity,
			pod_price,
			pod_vat,
			pod_wht_id,
			pod_crate,
		} = v
		const sql = `CALL New_purchase_order_details(${po_id}, ${pod_type_id}, ${pod_item}, ${pod_quantity}, ${unit_count_id}, ${pod_price}, ${pod_vat}, ${pod_wht_id}, ${pod_crate})`
		db.query(sql, (err, result) => {
			if (err) {
				return res
					.status(500)
					.json({ success: false, message: "Internal Server Error" })
			}
		})
	}
	return res.status(200).json({ success: true, message: "Success" })
}

const getPurchaseOrderDetails = (req, res) => {
	const po_id = req.query.po_id
	const sql = `SELECT * FROM purchase_order_details WHERE po_id = '${po_id}'`
	db.query(sql, (err, result) => {
		if (err) {
			return res
				.status(500)
				.json({ success: false, message: "Internal Server Error" })
		}
		return res
			.status(200)
			.json({ success: true, message: "Success", data: result })
	})
}
const purchaseOrderStatus = (req, resp) => {
	const po_id = req.body.po_id

	if (po_id == "" || !po_id) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Pod Id",
		})
		return
	}

	db.query(
		`SELECT po_id, po_status FROM purchase_order WHERE po_id = "${po_id}"`,
		(error, data) => {
			if (error) {
				resp.status(500).send({
					success: false,
					message: error,
				})
				return
			}

			if (data.length === 0) {
				resp.status(200).send({
					success: false,
					message: "Po Id Does Not Exist",
				})
				return
			}
			db.query(
				`UPDATE purchase_order SET po_status = "${
					data[0].po_status == 0
				}" WHERE po_id = "${po_id}"`,
				(statusErr, statusResp) => {
					if (statusErr) {
						resp.status(500).send({
							success: false,
							message: statusErr,
						})
						return
					}
					resp.status(200).send({
						success: true,
						status: updatePurchaseStatus(),
						message: "Purchase Order Status Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const getDropdownType = (req, res) => {
	db.query("SELECT * FROM dropdown_type", (error, data) => {
		if (error) {
			res.status(500).send({
				success: false,
				message: error,
			})
			return
		}

		res.status(200).send({
			success: true,
			message: "Getting Data Successfully",
			data: data,
		})
		return
	})
}

const deletePurchaseOrderDetails = (req, res) => {
	const pod_id = req.body.pod_id
	const sql = `DELETE FROM purchase_order_details WHERE pod_id = '${pod_id}' LIMIT 1`
	db.query(sql, (err, result) => {
		if (err) {
			return res
				.status(500)
				.json({ success: false, message: "Internal Server Error" })
		}
		return res.status(200).json({ success: true, message: "Success" })
	})
}

const updatePurchaseOrderDetails = (req, res) => {
	const { data } = req.body
	for (const v of data) {
		const {
			pod_id,
			pod_type_id,
			unit_count_id,
			pod_item,
			pod_quantity,
			pod_price,
			pod_vat,
			pod_wht_id,
			pod_crate,
		} = v
		const sql = `UPDATE purchase_order_details SET pod_type_id = '${pod_type_id}', unit_count_id = '${unit_count_id}', pod_item = '${pod_item}', pod_quantity = '${pod_quantity}', pod_price = '${pod_price}', pod_vat = '${pod_vat}', pod_wht_id = '${pod_wht_id}', pod_crate = '${pod_crate}' WHERE pod_id = '${pod_id}'`
		db.query(sql, (err, result) => {
			if (err) {
				return res
					.status(500)
					.json({ success: false, message: "Internal Server Error" })
			}
		})
	}
	return res.status(200).json({ success: true, message: "Success" })
}

module.exports = {
	addPurchageOrder,
	newAddPurchaseOrder,
	getPurchaseOrder,
	updatePurchaseOrder,
	purchaseOrderDetails,
	purchaseOrderStatus,
	getDropdownType,
	getNewPurchaseOrder,
	newUpdatePurchaseOrder,
	addPurchaseOrderDetails,
	getPurchaseOrderDetails,
	deletePurchaseOrderDetails,
	updatePurchaseOrderDetails,
}
