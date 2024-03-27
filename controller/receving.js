const { db: db2 } = require("../db/db2")

const getAllReceving = async (req, res) => {
	try {
		const [data] = await db2.query(
			"SELECT a.*, b.status as statusName FROM `receiving` as a INNER JOIN `dropdown_status` as b ON a.Status = b.status_id",
		)
		res.status(200).json({
			message: "All Receving",
			data: data,
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

const getViewToReceving = async (req, res) => {
	try {
		const [data] = await db2.query(`
            SELECT a.*, b.unit_id 
            FROM to_receive AS a 
            INNER JOIN dropdown_unit_count AS b 
            ON a.unit = b.unit_name_en 
        `);
		/* const [data] = await db2.query(`
					SELECT a.*, b.unit_id 
					FROM to_receive AS a 
					INNER JOIN dropdown_unit_count AS b 
					ON a.unit COLLATE utf8mb4_general_ci = b.unit_name_en COLLATE utf8mb4_general_ci
				`); */
		res.status(200).json({
			data: data,
		});
	} catch (e) {
		res.status(400).json({
			message: "Error Occurred",
			error: e,
		});
	}
};


const getAllReceving_bp = async (req, res) => {
	try {
		const [data] = await db2.query("SELECT * FROM receiving")
		res.json({ data })
	} catch (error) {
		res.status(400).json({
			error: error,
		})
	}
}

const addReceving = async (req, res) => {
	const {
		pod_code,
		rcv_crate,
		rcvd_qty,
		rcv_crate_weight,
		rcv_gross_weight,
		rcvd_unit_id,
		pod_type_id,
	} = req.body
	try {
		await db2.query(
			`CALL ${+pod_type_id == 3 ? "New_Receiving" : "New_Receiving_BP"
			}(?, ?, ?, ?, ?, ?)`,
			[
				pod_code,
				rcv_crate,
				rcvd_qty,
				rcv_crate_weight,
				rcv_gross_weight,
				rcvd_unit_id,
			],
		)
		res.status(200).json({
			message: "All Receving",
		})
	} catch (e) {
		res.status(400).json({
			message: "Error Occured",
			error: e,
		})
	}
}

module.exports = {
	getAllReceving,
	getAllReceving_bp,
	getViewToReceving,
	addReceving,
}
