const db = require("../../db/dbConnection")
const getInventoryID = require("../../function/genInventoryID")
const { db: db2 } = require("../../db/db2")

const addPackage = async (req, res) => {
	const packagingName = req.body.packaging_name
	const packagingWeight = req.body.packaging_weight
	const packagingInventoryTypeId = req.body.packaging_inventory_type_id
	const inventoryId = req.body.Inventory_ID
	try {
		const query =
			"INSERT INTO setup_packaging(packaging_name, packaging_weight, Inventory_ID, packaging_inventory_type_id) VALUES (?, ?, ?, ?)"
		const values = [
			packagingName,
			packagingWeight,
			inventoryId,
			packagingInventoryTypeId,
		]
		const [data] = await db2.execute(query, values)
		await db2.execute(
			"UPDATE setup_packaging SET Inventory_ID = ? WHERE packaging_id = ?",
			[
				getInventoryID(data.insertId, "", packagingInventoryTypeId),
				data.insertId,
			],
		)
		res.status(200).send({
			success: true,
			message: "Packaging Added Successfully",
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const updatePackaging = async (req, res) => {
	const packagingId = req.body.packaging_id
	const packagingName = req.body.packaging_name
	const packagingWeight = req.body.packaging_weight
	const packaging_inventory_type_id = req.body.packaging_inventory_type_id
	const Inventory_ID = req.body.Inventory_ID

	try {
		await db2.execute(
			`UPDATE setup_packaging SET packaging_name = "${packagingName}", packaging_weight = "${packagingWeight}", Inventory_ID = "${getInventoryID(
				packagingId,
				"",
				packaging_inventory_type_id,
			)}", packaging_inventory_type_id="${packaging_inventory_type_id}" WHERE packaging_id = "${packagingId}"`,
		)
		res.status(200).send({
			success: true,
			message: "Packaging Updated Successfully",
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const getAllPackaging = (req, res) => {
	db.query("SELECT * FROM setup_packaging", (error, getPackagingData) => {
		if (error) {
			res.status(500).send({
				success: false,
				message: error,
			})
			return
		}
		res.status(200).send({
			success: true,
			message: "Getting Packaging Data Successfully",
			data: getPackagingData,
		})
		return
	})
}

const addAirport = (req, res) => {
	const {
		port_type_id,
		port_name,
		port_country,
		port_city,
		Seaport_code,
		IATA_code,
		ICAO_Code,
	} = req.body

	if (port_type_id == "" || !port_type_id) {
		res.status(400).send({
			success: false,
			message: "Please Provide Port Type Id",
		})
		return
	}

	if (port_name == "" || !port_name) {
		res.status(400).send({
			success: false,
			message: "Please Enter Port Name",
		})
		return
	}

	if (port_country == "" || !port_country) {
		res.status(400).send({
			success: false,
			message: "Please Enter Port Country",
		})
		return
	}

	if (port_city == "" || !port_city) {
		res.status(400).send({
			success: false,
			message: "Please Enter Port City",
		})
		return
	}

	db.query(
		`SELECT port_name FROM setup_ports WHERE port_name = "${port_name}"`,
		(error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return
			}

			if (data.length > 0) {
				res.status(200).send({
					success: false,
					message: "Port Name Already Exist",
				})
				return
			}
			db.query(
				`INSERT INTO setup_ports (port_type_id,port_name,port_country,port_city, status, IATA_code, ICAO_Code, Seaport_code) VALUES ('${port_type_id}', '${port_name}', '${port_country}', '${port_city}', '${"on"}', '${IATA_code}', '${ICAO_Code}', '${Seaport_code}')`,
				(insertErr, updateErr) => {
					if (insertErr) {
						res.status(500).send({
							success: false,
							message: insertErr,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Port Added Successfully",
					})
					return
				},
			)
		},
	)
}

const updateAirPort = (req, res) => {
	const {
		port_id,
		port_type_id,
		port_name,
		port_country,
		port_city,
		Seaport_code,
		IATA_code,
		ICAO_Code,
	} = req.body

	if (port_id == "" || !port_id) {
		res.status(400).send({
			success: false,
			message: "Please Provide Port Id",
		})
		return
	}

	if (port_type_id == "" || !port_type_id) {
		res.status(400).send({
			success: false,
			message: "Please Provide Port Type Id",
		})
		return
	}

	if (port_name == "" || !port_name) {
		res.status(400).send({
			success: false,
			message: "Please Provide Port Name",
		})
		return
	}

	if (port_country == "" || !port_country) {
		res.status(400).send({
			success: false,
			message: "Please Provide Country",
		})
		return
	}

	if (port_city == "" || !port_city) {
		res.status(400).send({
			success: false,
			message: "Port Provide City",
		})
		return
	}

	db.query(
		`SELECT port_id FROM setup_ports WHERE port_id = "${port_id}"`,
		(err, data) => {
			if (err) {
				res.status(500).send({
					success: false,
					message: err,
				})
				return
			}

			if (data.length === 0) {
				res.status(200).send({
					success: false,
					message: "Port Id Does Not Exist",
				})
				return
			}
			db.query(
				`UPDATE setup_ports SET port_type_id = "${port_type_id}", port_name = "${port_name}", port_country = "${port_country}", port_city = "${port_city}", IATA_code = "${IATA_code}", ICAO_Code = "${ICAO_Code}", Seaport_code = "${Seaport_code}" WHERE port_id = "${port_id}"`,
				(updateErr, updateRes) => {
					if (updateErr) {
						res.status(500).send({
							success: false,
							message: updateErr,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Port Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const updateAirportStatus = (req, res) => {
	const portId = req.body.port_id

	if (portId == "" || !portId) {
		res.status(400).send({
			success: false,
			message: "Please Provide Port Id",
		})
		return
	}

	db.query(
		`SELECT port_id, status FROM setup_ports WHERE port_id = "${portId}"`,
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
					message: "Port Id Does Not Exist",
				})
				return
			}
			const updateStatus = () => {
				if (data[0].status == "on") {
					return "off"
				}
				if (data[0].status == "off") {
					return "on"
				}
				return "on"
			}

			db.query(
				`UPDATE setup_ports SET status = "${updateStatus()}" WHERE port_id = "${portId}"`,
				(updateErr, updateRes) => {
					if (updateErr) {
						res.status(500).send({
							success: false,
							message: updateErr,
						})
						return
					}
					res.status(200).send({
						success: true,
						status: updateStatus(),
						message: "Port Status Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const getAllAirports = async (req, res) => {
	try {
		const [data] = await db2.query(
			"SELECT a.*, b.port_type FROM setup_ports a INNER JOIN dropdown_port_type b ON a.port_type_id = b.port_type_id",
		)
		res.status(200).send({
			success: true,
			message: "Getting Airport Data Successfully",
			data: data,
		})
	} catch (error) {
		res.status(500).send({
			success: false,
			message: error,
		})
	}
}

const addBank = (req, res) => {
	const {
		Bank_nick_name,
		bank_name,
		bank_account_number,
		Account_Name,
		Currency,
		Bank_Address,
		Swift,
		IBAN,
	} = req.body

	if (bank_name == "" || !bank_name) {
		res.status(400).send({
			success: false,
			message: "Please Enter Bank Name",
		})
		return
	}

	if (bank_account_number == "" || !bank_account_number) {
		res.status(400).send({
			success: false,
			message: "Please Enter Bank Acccount Number",
		})
		return
	}

	db.query(
		`SELECT bank_account_number FROM setup_bank WHERE bank_account_number = "${bank_account_number}"`,
		(err, data) => {
			if (err) {
				res.status(500).send({
					success: false,
					message: err,
				})
				return
			}

			if (data.length > 0) {
				res.status(200).send({
					success: false,
					message: "Bank Account Number Already Exist",
				})
				return
			}
			db.query(
				`INSERT INTO setup_bank(bank_name, bank_account_number, Bank_nick_name, Account_Name, Currency, Bank_Address, Swift, IBAN) VALUES('${bank_name}', '${bank_account_number}', '${Bank_nick_name}', '${Account_Name}', '${Currency}', '${Bank_Address}', '${Swift}', '${IBAN}')`,
				(insertErr, insertRes) => {
					if (insertErr) {
						res.status(500).send({
							success: false,
							message: insertErr,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Data Inserted Successfully",
					})
					return
				},
			)
		},
	)
}

const updateBank = (req, res) => {
	const {
		bank_id,
		bank_name,
		bank_account_number,
		Bank_nick_name,
		Account_Name,
		Currency,
		Bank_Address,
		Swift,
		IBAN,
	} = req.body

	if (bank_id == "" || !bank_id) {
		res.status(400).send({
			success: false,
			message: "Please Provide Bank Id",
		})
		return
	}

	if (bank_name == "" || !bank_name) {
		res.status(400).send({
			success: false,
			message: "Please Provide Bank Name",
		})
		return
	}

	if (bank_account_number == "" || !bank_account_number) {
		res.status(400).send({
			success: false,
			message: "Please Provide Bank Account Number",
		})
		return
	}

	db.query(
		`SELECT bank_id FROM setup_bank WHERE bank_id = "${bank_id}"`,
		(err, data) => {
			if (err) {
				res.status(500).send({
					success: false,
					message: err,
				})
				return
			}

			if (data.length === 0) {
				res.status(200).send({
					success: false,
					message: "Bank Id Does Not Exist",
				})
				return
			}
			// console.log(data)
			db.query(
				`UPDATE setup_bank SET bank_name = "${bank_name}", bank_account_number = "${bank_account_number}", Bank_nick_name = "${Bank_nick_name}", Account_Name = "${Account_Name}", Currency = "${Currency}", Bank_Address = "${Bank_Address}", Swift = "${Swift}", IBAN = "${IBAN}" WHERE bank_id = "${bank_id}"`,
				(updateErr, updateRes) => {
					if (updateErr) {
						res.status(500).send({
							success: false,
							message: updateErr,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Bank Details Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const updateBankStatus = (req, res) => {
	const bankId = req.body.bank_id

	if (bankId == "" || !bankId) {
		res.status(400).send({
			success: false,
			message: "Please Provide Bank Id",
		})
		return
	}

	db.query(
		`SELECT status, bank_id FROM setup_bank WHERE bank_id = "${bankId}"`,
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
					message: "Bank Id Does Not Exist",
				})
				return
			}
			const updateStatus = () => {
				if (data[0].status == 1) {
					return 0
				}

				if (data[0].status == 0) {
					return 1
				}
				return 1
			}

			db.query(
				`UPDATE setup_bank SET status = "${updateStatus()}" WHERE bank_id = "${bankId}"`,
				(updateError, updateResp) => {
					if (updateError) {
						res.status(500).send({
							success: false,
							message: updateError,
						})
						return
					}
					res.status(200).send({
						success: true,
						bankStatus: updateStatus(),
						message: "Bank Status Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const getBank = (req, res) => {
	db.query("SELECT * FROM setup_bank", (error, data) => {
		if (error) {
			res.status(500).send({
				success: false,
				message: error,
			})
			return
		}

		if (data.length === 0) {
			res.status(200).send({
				success: true,
				message: "Empty Data",
			})
			return
		}
		res.status(200).send({
			success: true,
			message: "Getting Bank Data Successfully",
			bankData: data,
		})
		return
	})
}

const addClearance = (req, res) => {
	const {
		vendor_id,
		from_port,
		custom_clearance_charges,
		phyto_charges,
		co_chamber_charges,
		extra_charges,
	} = req.body

	if (vendor_id == "" || !vendor_id) {
		res.status(400).send({
			success: false,
			message: "Please Provide Vendor Id",
		})
		return
	}

	if (from_port == "" || !from_port) {
		res.status(400).send({
			success: false,
			message: "Please Provide From Port",
		})
		return
	}

	if (custom_clearance_charges == "" || !custom_clearance_charges) {
		res.status(400).send({
			success: false,
			message: "Please Enter Custom Clearence Charges",
		})
		return
	}

	if (phyto_charges == "" || !phyto_charges) {
		res.status(400).send({
			success: false,
			message: "Please Enter Phyto Charges",
		})
		return
	}

	if (co_chamber_charges == "" || !co_chamber_charges) {
		res.status(400).send({
			success: false,
			message: "Please Enter Co Chember Charges",
		})
		return
	}

	if (extra_charges == "" || !extra_charges) {
		res.status(400).send({
			success: false,
			message: "Please Enter Extra Charges",
		})
		return
	}

	db.query(
		`SELECT Clearance_provider FROM setup_clearance WHERE Clearance_provider = "${vendor_id}"`,
		(error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return
			}

			if (data.length > 0) {
				res.status(200).send({
					success: false,
					message: "Vendor Id Already Exist",
				})
				return
			}
			db.query(
				`INSERT INTO setup_clearance(Clearance_provider, from_port, custom_clearance_charges , phyto_charges, co_chamber_charges, extra_charges, status, created) VALUES('${vendor_id}', '${from_port}', '${custom_clearance_charges}', '${phyto_charges}', '${co_chamber_charges}', '${extra_charges}', '${"on"}', now())`,
				(insertErr, insertRes) => {
					if (insertErr) {
						res.status(500).send({
							success: false,
							message: insertErr,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Clearence Added Successfully",
					})
					return
				},
			)
		},
	)
}

const updateclearance = (req, res) => {
	const {
		clearance_id,
		vendor_id,
		from_port,
		custom_clearance_charges,
		phyto_charges,
		co_chamber_charges,
		extra_charges,
	} = req.body

	if (clearance_id == "" || !clearance_id) {
		res.status(400).send({
			success: false,
			message: "Please Provide Clearance Id",
		})
		return false
	}

	if (vendor_id == "" || !vendor_id) {
		res.status(400).send({
			success: false,
			message: "Please Provide Vendor Id",
		})
		return false
	}

	if (from_port == "" || !custom_clearance_charges) {
		res.status(400).send({
			success: false,
			message: "Please Provide Custom Clearance Charges",
		})
		return false
	}

	if (phyto_charges == "" || !phyto_charges) {
		res.status(400).send({
			success: false,
			message: "Please Provide Phyto Charges",
		})
		return false
	}

	if (co_chamber_charges == "" || !co_chamber_charges) {
		res.status(400).send({
			success: false,
			message: "Please Provide Co Chember Charges",
		})
		return false
	}

	db.query(
		`SELECT clearance_id FROM setup_clearance WHERE clearance_id = "${clearance_id}"`,
		(error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return false
			}

			if (data.length === 0) {
				res.status(200).send({
					success: false,
					message: "Clearance Id Does Not Exist",
				})
				return false
			}
			db.query(
				`UPDATE setup_clearance SET Clearance_provider = "${vendor_id}", from_port = "${from_port}", custom_clearance_charges = "${custom_clearance_charges}", phyto_charges = "${phyto_charges}", co_chamber_charges = "${co_chamber_charges}", extra_charges = "${extra_charges}" WHERE clearance_id = "${clearance_id}"`,
				(updateError, updateResp) => {
					if (updateError) {
						res.status(500).send({
							success: false,
							message: updateError,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Clearance Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const updateClearanceStatus = (req, res) => {
	const clearanceId = req.body.clearance_id

	if (clearanceId == "" || !clearanceId) {
		res.status(400).send({
			success: false,
			message: "Please Provide Clearance Id",
		})
		return
	}

	db.query(
		`SELECT clearance_id, status FROM setup_clearance WHERE clearance_id = "${clearanceId}"`,
		(error, getData) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return
			}

			if (getData.length === 0) {
				res.status(200).send({
					success: false,
					message: "Clearance Id Does Not Exist",
				})
				return
			}
			const updateStatus =
				`${getData[0]?.status || ""}`.toLocaleLowerCase() === "on"
					? "off"
					: "on"

			db.query(
				`UPDATE setup_clearance SET status = "${updateStatus}", updated = now() WHERE clearance_id = "${clearanceId}"`,
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
						clearanceStatus: updateStatus,
						message: "Clearance Status Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const getAllClearance = async (req, res) => {
	try {
		const [data] = await db2.query(
			"SELECT a.*, b.name, b.vendor_id, d.port_type FROM setup_clearance a INNER JOIN vendors b ON a.Clearance_provider = b.vendor_id INNER JOIN setup_ports c ON a.from_port = c.port_id INNER JOIN dropdown_port_type d ON c.port_type_id =  d.port_type_id",
		)
		res.status(200).send({
			success: true,
			message: "Getting Clearance Data Successfully",
			data: data,
		})
	} catch (e) {
		res.status(500).send({
			success: false,
			message: e,
		})
	}
}

const addTransPort = (req, res) => {
	const {
		Transportation_provider,
		loading_from,
		departure_port,
		port_type,
		truck1,
		max_weight1,
		max_cbm1,
		max_pallet1,
		price1,
		truck2,
		max_weight2,
		max_cbm2,
		max_pallet2,
		price2,
		truck3,
		max_weight3,
		max_cbm3,
		max_pallet3,
		price3,
	} = req.body

	if (Transportation_provider == "" || !Transportation_provider) {
		res.status(400).send({
			success: false,
			message: "Please Provide Supplier Id",
		})
		return
	}

	if (loading_from == "" || !loading_from) {
		res.status(400).send({
			success: false,
			message: "Please Enter Loading From ",
		})
		return
	}

	if (departure_port == "" || !departure_port) {
		res.status(400).send({
			success: false,
			message: "Please Enter Departure Port",
		})
		return
	}

	if (port_type == "" || !port_type) {
		res.status(400).send({
			success: false,
			message: "Please Enter Port Type",
		})
		return
	}

	db.query(
		`SELECT Transportation_provider FROM setup_transportation WHERE Transportation_provider = "${Transportation_provider}"`,
		(error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return
			}

			if (data.length > 0) {
				res.status(200).send({
					success: false,
					message: "Supplier Already Exist",
				})
				return
			}
			db.query(
				`INSERT INTO setup_transportation(Transportation_provider, loading_from, departure_port, port_type, truck1, max_weight1, max_cbm1, max_pallet1, price1, truck2, max_weight2, max_cbm2, max_pallet2, price2, truck3, max_weight3, max_cbm3, max_pallet3, price3 ) VALUES('${Transportation_provider}', '${loading_from}', '${departure_port}', '${port_type}', '${truck1}', '${max_weight1}', '${max_cbm1}', '${max_pallet1}', '${price1}', '${truck2}', '${max_weight2}', '${max_cbm2}', '${max_pallet2}', '${price2}', '${truck3}', '${max_weight3}', '${max_cbm3}', '${max_pallet3}', '${price3}')`,
				(insertErr, insertResp) => {
					if (insertErr) {
						res.status(500).send({
							success: false,
							message: insertErr,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Data Inserted Successfully",
					})
					return
				},
			)
		},
	)
}

const updateTransportation = (req, res) => {
	const {
		transport_id,
		Transportation_provider,
		loading_from,
		departure_port,
		port_type,
		truck1,
		max_weight1,
		max_cbm1,
		max_pallet1,
		price1,
		truck2,
		max_weight2,
		max_cbm2,
		max_pallet2,
		price2,
		truck3,
		max_weight3,
		max_cbm3,
		max_pallet3,
		price3,
	} = req.body

	if (transport_id == "" || !transport_id) {
		res.status(400).send({
			success: false,
			message: "Please Provide Transport Id",
		})
		return
	}

	if (Transportation_provider == "" || !Transportation_provider) {
		res.status(400).send({
			success: false,
			message: "Please Provide Supplier Id",
		})
		return
	}

	if (loading_from == "" || !loading_from) {
		res.status(400).send({
			success: false,
			message: "Please Provide Loading From",
		})
		return
	}

	if (departure_port == "" || !departure_port) {
		res.status(400).send({
			success: false,
			message: "Please Provide Departure Port",
		})
		return
	}

	if (port_type == "" || !port_type) {
		res.status(400).send({
			success: false,
			message: "Please Provide Port Type",
		})
		return
	}

	db.query(
		`SELECT transport_id FROM setup_transportation WHERE transport_id = "${transport_id}"`,
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
					message: "Trasport Id Does Not Exist",
				})
				return
			}
			db.query(
				`UPDATE setup_transportation SET Transportation_provider = "${Transportation_provider}", loading_from = "${loading_from}", departure_port = "${departure_port}", port_type = "${port_type}", truck1 = "${
					truck1 || ""
				}", max_weight1 = "${max_weight1}", max_cbm1 = "${max_cbm1}", max_pallet1 = "${max_pallet1}", price1 = "${price1}", truck2 = "${
					truck2 || ""
				}", max_weight2 = "${max_weight2}", max_cbm2 = "${max_cbm2}", max_pallet2 = "${max_pallet2}", price2 = "${price2}", truck3 = "${
					truck3 || ""
				}", max_weight3 = "${max_weight3}", max_cbm3 = "${max_cbm3}", max_pallet3 = "${max_pallet3}", price3 = "${price3}" WHERE transport_id = ${transport_id} LIMIT 1`,
				(updateError, updateResp) => {
					if (updateError) {
						res.status(500).send({
							success: false,
							message: updateError,
						})
						return
					}
					res.status(200).send({
						success: true,
						message: "Transport Data Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const getTransportation = (req, res) => {//setup_ports
	db.query(
		`SELECT a.*, b.name, c.port_type, c.port_type_id, s.name as location, p.port_name as port FROM setup_transportation a 
		INNER JOIN vendors b ON a.Transportation_provider = b.vendor_id 
		INNER JOIN dropdown_port_type c ON a.port_type = c.port_type_id
		INNER JOIN setup_location s ON a.loading_from = s.id
		INNER JOIN setup_ports p ON a.departure_port = p.port_id 
		`,
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
					message: "Empty Data",
				})
				return
			}
			res.status(200).send({
				success: true,
				message: "Getting Transport Data Successfully",
				transportData: data,
			})
			return
		},
	)
}

const getSelectedPakagingForEan = (req, res) => {
	db.query(
		"SELECT packaging_id, packaging_name, type_id FROM setup_packaging ",
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
				data: data,
			})
			return
		},
	)
}

const addEan = (request, response) => {
	const values = [
		[
			request.body.ean_id,
			request.body.produce_id,
			request.body.ean_produce_qty_grams,
			request.body.user,
		],
	]

	for (const record of dataToInsert) {
		const sql =
			"INSERT INTO ean_produce (ean_id , produce_id, ean_produce_qty_grams, user) VALUES ?"

		db.query(sql, [values], (err, result) => {
			if (err) {
				response.status(500).send({
					success: false,
					message: err,
				})
				return false
			}
			response.status(200).send({
				success: true,
				message: `Number of records inserted: ${result.affectedRows}`,
			})
		})
	}
}

const addEanPackaging = (req, res) => {
	const { ean_id, type_id, packaging_id, qty } = req.body

	if (!ean_id || ean_id == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide Ean Id",
		})
		return
	}

	if (!packaging_id || packaging_id == 0) {
		res.status(400).send({
			success: false,
			message: "Please Provide Packaging Id",
		})
		return
	}

	if (!qty || qty == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide qty",
		})
		return
	}

	for (let i = 0; i < packaging_id.length; i++) {
		if (packaging_id[i] == 0) {
			continue
		}

		const sql =
			"INSERT INTO `ean_packaging`(`ean_id`, `type_id`, `packaging_id`, `qty`) VALUES (?, ?, ?, ?);"
		const values = [ean_id[i], 1, packaging_id[i], qty[i]]

		db.query(sql, values, (error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return
			}
		})
	}
	res.status(200).send({
		success: true,
		message: "Data Inserted Successfully",
	})
	return
}

const addEanProduce = (req, res) => {
	const { ean_id, produce_id, ean_produce_qty_grams } = req.body

	if (!ean_id || ean_id == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide Ean Id",
		})
		return
	}

	if (!produce_id || produce_id == 0) {
		res.status(400).send({
			success: false,
			message: "Please Prodvide ",
		})
		return
	}

	if (!ean_produce_qty_grams || ean_produce_qty_grams == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide ean_produce_qty_grams",
		})
		return
	}

	for (let i = 0; i < produce_id.length; i++) {
		if (produce_id[i] == 0) {
			continue
		}

		const sql =
			"INSERT INTO ean_produce(ean_id, produce_id, ean_produce_qty_grams) VALUES(?,?,?)"
		const values = [ean_id[i], produce_id[i], ean_produce_qty_grams[i]]

		db.query(sql, values, (err, data) => {
			if (err) {
				res.status(500).send({
					success: false,
					message: err,
				})
				return
			}
		})
	}
	res.status(200).send({
		success: true,
		message: "success",
	})
	return
}

const newUpdateEanName = (req, res) => {
	const ean_id = req.body.ean_id
	const sql = `CALL New_Update_EAN_name(${ean_id})`

	db.query(sql, true, (error, results, fields) => {
		if (error) {
			res.status(500).send({
				success: false,
				message: error,
			})
			return
		}
		console.log(results[0])
		res.status(200).send({
			success: true,
			data: results,
		})
	})
}

const editEanPackaging = (req, res) => {
	const { ean_id, type_id, packaging_id, qty } = req.body

	if (!ean_id || ean_id == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide Ean Id",
		})
		return false
	}

	if (!packaging_id || packaging_id == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide Packaging Id",
		})
		return
	}

	if (!qty || qty == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide qty",
		})
		return
	}

	db.query(
		`SELECT ean_detail_id FROM ean_packaging WHERE ean_id ="${ean_id}"`,
		(error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return
			}
			// console.log(data.ean_detail_id, "checkkk")

			for (let i = 0; i < data.length; i++) {
				if (packaging_id[i] == 0) {
					continue
				}

				const sql = `UPDATE ean_packaging SET packaging_id = ?, qty = ? WHERE ean_detail_id = ${data[i].ean_detail_id} `
				const values = [packaging_id[i], qty[i]]

				db.query(sql, values, (error, data) => {
					if (error) {
						res.status(500).send({
							success: false,
							message: error,
						})
						return
					}
				})
			}
			res.status(200).send({
				success: true,
				message: "Updated Successfully",
			})
			return
		},
	)
}

const editEanProduce = (req, res) => {
	const { ean_id, produce_id, ean_produce_qty_grams } = req.body

	if (!ean_id || ean_id == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide Ean Id",
		})
		return false
	}

	if (!produce_id || produce_id == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide produce_id",
		})
		return
	}

	if (!ean_produce_qty_grams || ean_produce_qty_grams == "") {
		res.status(400).send({
			success: false,
			message: "Please Provide ean_produce_qty_grams",
		})
		return
	}

	db.query(
		`SELECT ean_produce_id FROM ean_produce WHERE ean_id ="${ean_id}"`,
		(error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return
			}
			// console.log(data.ean_detail_id, "checkkk")

			for (let i = 0; i < data.length; i++) {
				if (produce_id[i] == 0) {
					continue
				}

				const sql = `UPDATE ean_produce SET produce_id = ?, ean_produce_qty_grams = ? WHERE ean_produce_id = ${data[i].ean_produce_id} `
				const values = [produce_id[i], ean_produce_qty_grams[i]]

				db.query(sql, values, (error, data) => {
					if (error) {
						res.status(500).send({
							success: false,
							message: error,
						})
						return
					}
				})
			}
			res.status(200).send({
				success: true,
				message: "Updated Successfully",
			})
			return
		},
	)
}

const deleteEanPackaging = (req, res) => {
	const { ean_detail_id } = req.body

	db.query(
		`DELETE FROM ean_packaging WHERE ean_detail_id = "${ean_detail_id}"`,
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
				message: "Data Deleted Successfully",
			})
			return
		},
	)
}

const deleteEanProduce = (req, res) => {
	const { ean_produce_id } = req.body

	db.query(
		`DELETE FROM ean_details WHERE ean_detail_id = "${ean_produce_id}"`,
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
				message: "Data Deleted Successfully",
			})
			return
		},
	)
}

const updateEan = (request, response) => {
	const { ean_name, ean_unit, ean_id } = request.body

	if (ean_id == "" || !ean_id) {
		response.status(400).send({
			success: false,
			message: "Please Provide Ean Id",
		})
		return
	}

	if (ean_name == "" || !ean_name) {
		response.status(400).send({
			success: false,
			message: "Please Provide Ean _Name",
		})
		return
	}

	if (ean_unit == "" || !ean_unit) {
		response.status(400).send({
			success: false,
			message: "Please Provide Ean Unit",
		})
		return
	}

	db.query(
		`SELECT ean_id FROM ean WHERE ean_id = "${ean_id}"`,
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
					success: false,
					message: "Ean Id Does Not Exist",
				})
				return
			}
			db.query(
				`UPDATE ean SET ean_name = "${ean_name}", ean_unit = "${ean_unit}" WHERE ean_id = "${ean_id}"`,
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
						message: "Ean Data Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const getEanData = (request, response) => {
	db.query(
		"SELECT a.*, b.ean_packaging_weight, b.ean_net_weight, b.ean_gross_weight from ean a INNER JOIN ean_weight b ON a.ean_id = b.ean_id",
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
					message: "Empty Data",
				})
				return
			}
			response.status(200).send({
				success: true,
				message: "Getting Data Succssfully",
				data: data,
			})
			return
		},
	)
}

const getEanPackagingData = (req, res) => {
	db.query(
		`SELECT * FROM ean_packaging WHERE ean_id = "${req.body.ean_id}" AND packaging_id != 0`,
		(err, data) => {
			if (err) {
				res.status(500).send({
					success: false,
					message: err,
				})
				return
			}
			res.status(200).send({
				success: true,
				message: "Getting Data Successfully",
				data: data,
			})
			return
		},
	)
}

const getEanProduceData = (req, res) => {
	db.query(
		`SELECT * FROM ean_produce WHERE ean_id = "${req.body.ean_id}" AND produce_id != 0`,
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
				data: data,
			})
			return
		},
	)
}

const eanStatusUpdate = (req, resp) => {
	const eanId = req.body.ean_id

	if (eanId == "" || !eanId) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Ean Id",
		})
		return
	}

	db.query(
		`SELECT ean_id, status FROM ean WHERE ean_id = "${eanId}"`,
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
					message: "Ean Id Does Not Exist",
				})
				return
			}
			const statusUpdate = () => {
				if (data[0].status === "on") {
					return "off"
				}

				if (data[0].status === "off") {
					return "on"
				}
				return "on"
			}

			db.query(
				`UPDATE ean SET status = "${statusUpdate()}" WHERE ean_id = "${eanId}"`,
				(updateErr, updateResp) => {
					if (updateErr) {
						resp.status(500).send({
							success: false,
							message: updateErr,
						})
						return
					}
					resp.status(200).send({
						success: true,
						status: statusUpdate(),
						message: "Status Updated Successfully",
					})
					return
				},
			)
		},
	)
}

const addFreight = (req, resp) => {
	const {
		Freight_provider,
		liner,
		from_port,
		destination_port,
		port_type,
		range1,
		price1,
		range2,
		price2,
		range3,
		price3,
		range4,
		price4,
		range5,
		price5,
	} = req.body

	if (Freight_provider == "" || !Freight_provider) {
		resp.status(400).send({
			success: false,
			message: "Please Enter Supplier Id",
		})
		return
	}

	if (liner == "" || !liner) {
		resp.status(400).send({
			success: false,
			message: "Please Enter Liner",
		})
		return
	}

	if (from_port == "" || !from_port) {
		resp.status(400).send({
			success: false,
			message: "Please Enter From Port",
		})
		return
	}

	if (destination_port == "" || !destination_port) {
		resp.status(400).send({
			success: false,
			message: "Please Enter Destination Port",
		})
		return
	}

	if (port_type == "" || !port_type) {
		resp.status(400).send({
			success: false,
			message: "Please Enter Port Type",
		})
		return
	}

	db.query(
		`INSERT INTO setup_freight (Freight_provider,liner,from_port, destination_port, port_type, range1, price1, range2, price2, range3, price3, range4, price4, range5, price5) VALUES('${Freight_provider}', '${liner}', '${from_port}', '${destination_port}', '${port_type}', ${
			range1 || "NULL"
		}, ${price1 || "NULL"}, ${range2 || "NULL"}, ${price2 || "NULL"}, ${
			range3 || "NULL"
		}, ${price3 || "NULL"}, ${range4 || "NULL"}, ${price4 || "NULL"}, ${
			range5 || "NULL"
		}, ${price5 || "NULL"})`,
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
				message: "Insert Data Successfully",
			})
			return
		},
	)
}

const updateFreight = (req, resp) => {
	const {
		id,
		Freight_provider,
		liner,
		from_port,
		destination_port,
		port_type,
		range1,
		price1,
		range2,
		price2,
		range3,
		price3,
		range4,
		price4,
		range5,
		price5,
	} = req.body

	if (id == "" || !id) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Id",
		})
		return
	}

	if (Freight_provider == "" || !Freight_provider) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Supplier Id",
		})
		return
	}

	if (liner == "" || !liner) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Liner",
		})
		return
	}

	if (destination_port == "" || !destination_port) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Destination Port",
		})
		return
	}

	if (port_type == "" || !port_type) {
		resp.status(400).send({
			success: false,
			message: "Please Provide Port Type",
		})
		return
	}

	db.query(`SELECT id FROM setup_freight WHERE id = "${id}"`, (error, data) => {
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
				message: "Id Does Not Exist",
			})
			return
		}
		db.query(
			`UPDATE setup_freight SET Freight_provider = "${Freight_provider}", liner = "${liner}", destination_port = "${destination_port}", from_port = "${from_port}", port_type = "${port_type}", range1 = ${
				range1 || "NULL"
			}, price1 = ${price1 || "NULL"}, range2 = ${range2 || "NULL"}, price2 = ${
				price2 || "NULL"
			}, range3 = ${range3 || "NULL"}, price3 = ${price3 || "NULL"}, range4 = ${
				range4 || "NULL"
			}, price4 = ${price4 || "NULL"}, range5 = ${range5 || "NULL"}, price5 = ${
				price5 || "NULL"
			} WHERE id = "${id}"`,
			(updateErr, updateResp) => {
				if (updateErr) {
					resp.status(500).send({
						success: false,
						message: updateErr,
					})
					return
				}
				resp.status(200).send({
					success: true,
					message: "Freight Updated Successfully",
				})
				return
			},
		)
	})
}

const getFreight = (request, response) => {
	db.query(
		"SELECT a.*, b.name AS Vendor, c.port_name AS DestinationPort, e.port_name AS FromPort, d.liner_name AS Airline FROM setup_freight a INNER JOIN vendors b ON a.freight_provider = b.vendor_id INNER JOIN setup_ports c ON a.destination_port = c.port_id INNER JOIN setup_liner d ON a.liner = d.liner_id INNER JOIN setup_ports e ON a.from_port = e.port_id",
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
					message: "No Freight Data Found",
				})
				return
			}
			response.status(200).send({
				success: true,
				message: "Getting Data Successfully",
				freightData: data,
			})
			return
		},
	)
}

const addItf = (req, res) => {
	const { itf_name_en, itf_name_th, itf_code, ITF_ean_adjustment } = req.body

	db.query(
		`INSERT INTO itf(itf_name_en, itf_name_th, itf_code, ITF_ean_adjustment) VALUES('${itf_name_en}', '${itf_name_th}', '${itf_code}', '${ITF_ean_adjustment}')`,
		(error, data) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
			}

			res.status(200).send({
				success: true,
				itf_id: data.insertId,
				message: "Inserted Successfully",
			})
		},
	)
}
const getVendorList = (req, res) => {
	db.query("SELECT name, vendor_id FROM vendors", (error, data) => {
		if (error) {
			res.status(500).send({
				success: false,
				message: error,
			})
			return
		}
		res.status(200).send({
			success: true,
			message: "Getting Successfully",
			vendorList: data,
		})
		return
	})
}

const getCurrency = async (req, resp) => {
	try {
		const [data] = await db2.query(
			`SELECT t.*, (select fx_rate_history.fx_rate
				from fx_rate_history,orders
				where t.currency_id=fx_rate_history.fx_id
				order by fx_rate_history.id DESC Limit 1) fx_rate FROM dropdown_currency t
	`,
		)
		resp.status(200).send({
			success: true,
			message: "Getting Data Successfully",
			data: data,
		})
	} catch (e) {
		resp.status(500).send({
			success: false,
			message: e,
		})
	}
}

const getIft = async (req, resp) => {
	try {
		// "SELECT * FROM itf as a INNER JOIN itf_weight as b ON a.itf_id = b.itf_id",
		const [data] = await db2.query(
			"SELECT * FROM itf as a INNER JOIN itf_weight as b ON a.itf_id = b.itf_id",
		)
		resp.status(200).send({
			success: true,
			message: "Getting Data Successfully",
			data: data,
		})
	} catch (e) {
		resp.status(500).send({
			success: false,
			message: e,
		})
	}
}

const getDropdownVendor = (req, res) => {
	db.query("SELECT * FROM dopdown_vendor_entity", (error, data) => {
		if (error) {
			res.status(500).send({
				success: false,
				message: error,
			})
			return false
		}
		res.status(200).send({
			success: true,
			message: "Getting Data Successfully",
			data: data,
		})
		return
	})
}

const setupLocation = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * FROM setup_location")

		res.status(200).send({
			success: true,
			message: "Getting Data Successfully",
			data: data,
		})
	} catch (error) {
		res.status(500).send({
			success: false,
			message: error,
		})
	}
}

const createSetupLocation = (req, res) => {
	const { name, address, gps_location } = req.body

	if (name === "" || !name) {
		res.status(400).send({
			success: false,
			message: "Please Provide Name",
		})
		return false
	}

	if (address == "" || !address) {
		res.status(400).send({
			success: false,
			message: "Please Provide Address",
		})
		return false
	}

	db.query(
		`INSERT INTO setup_location (name, address, gps_location) VALUES('${name}', '${address}', '${gps_location}')`,
		(error, insertResp) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return false
			}
			res.status(200).send({
				success: true,
				message: "Inserted Address Successfully",
			})
			return
		},
	)
}

const updateSetupLocation = (req, res) => {
	const { id, name, address, gps_location } = req.body

	if (id == "" || !id) {
		req.status(400).send({
			success: false,
			message: "Please Provide Id",
		})
		return false
	}

	if (name == "" || !name) {
		req.status(400).send({
			success: false,
			message: "Please Provide Name",
		})
		return false
	}

	if (address == "" || !address) {
		req.status(400).send({
			success: false,
			message: "Please Provide Address",
		})
	}

	if (gps_location == "" || !gps_location) {
		req.status(400).send({
			success: false,
			message: "Please Provide Gps Location",
		})
		return false
	}

	db.query(
		`UPDATE setup_location SET name = "${name}", address = "${address}", gps_location = "${gps_location}" WHERE id = "${req.body.id}"`,
		(error, updateData) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return false
			}
			res.status(200).send({
				success: true,
				message: "Location Data Updated Successfully",
			})
			return
		},
	)
}

const updateItf = (req, res) => {
	const {
		itf_id,
		itf_name_en,
		itf_name_th,
		itf_unit,
		itf_code,
		ITF_ean_adjustment,
	} = req.body
	db.query(
		"UPDATE itf SET itf_name_en = ?, itf_name_th = ?, itf_code = ?, ITF_ean_adjustment = ? WHERE itf_id = ?",
		[itf_name_en, itf_name_th, itf_code, ITF_ean_adjustment, itf_id],
		(error, updateData) => {
			if (error) {
				res.status(500).send({
					success: false,
					message: error,
				})
				return false
			}
			res.status(200).send({
				success: true,
				message: "ITF Data Updated Successfully",
			})
			return
		},
	)
}

module.exports = {
	addPackage,
	updatePackaging,
	getAllPackaging,
	addAirport,
	updateAirPort,
	updateAirportStatus,
	getAllAirports,
	addBank,
	updateBankStatus,
	getTransportation,
	updateBank,
	getBank,
	addClearance,
	updateclearance,
	updateClearanceStatus,
	getAllClearance,
	addTransPort,
	updateTransportation,
	addEan,
	updateEan,
	getEanData,
	eanStatusUpdate,
	addFreight,
	updateFreight,
	getFreight,
	updateItf,
	addItf,
	getVendorList,
	getCurrency,
	getIft,
	setupLocation,
	createSetupLocation,
	updateSetupLocation,
	getSelectedPakagingForEan,
	addEanPackaging,
	addEanProduce,
	getEanPackagingData,
	getEanProduceData,
	editEanPackaging,
	editEanProduce,
	deleteEanPackaging,
	deleteEanProduce,
	newUpdateEanName,
	getDropdownVendor,
}
