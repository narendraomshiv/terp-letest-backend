const { db } = require("../db/db2")

const dashboardOpertation = async (req, res) => {
	const [required_ean_en] = await db.query("SELECT * FROM required_ean_en;")
	const [required_ean_new] = await db.query("SELECT * FROM required_ean_new;")
	const [required_ean_th] = await db.query("SELECT * FROM required_ean_th;")
	const [required_itf_en] = await db.query("SELECT * FROM required_itf_en;")
	const [required_itf_th] = await db.query("SELECT * FROM required_itf_th")
	const [Orders_pipline] = await db.query("SELECT * FROM Orders_pipline")

	res.json({
		required_itf_th,
		required_itf_en,
		required_ean_th,
		required_ean_new,
		required_ean_en,
		Orders_pipline,
	})
}

module.exports = {
	dashboardOpertation,
}
