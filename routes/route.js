const { Router } = require("express")
const multer = require("multer")

const adminLogin = require("../controller/admin/adminLogin")
const {
	addClient,
	getAllClients,
	updateClientData,
	getClientAsOptions,
	clientShipTo,
	updateClientShipTo,
	getShipTo,
	updateClientStatus,
	updateShipToStatus,
} = require("../controller/clientManagement/client")
const {
	getEanDeatils,
	addEanDetails,
	updateEanDetails,
	createEan,
	EditEan,
	getEanDetailViews,
	createEanProducne,
	createEanPacking
} = require("../controller/ean/ean")

const {
	addPackage,
	updatePackaging,
	getAllPackaging,
	addAirport,
	updateAirPort,
	updateAirportStatus,
	getAllAirports,
	addBank,
	updateBank,
	updateBankStatus,
	getBank,
	addClearance,
	updateclearance,
	updateClearanceStatus,
	getAllClearance,
	addTransPort,
	updateTransportation,
	getTransportation,
	addEan,
	updateEan,
	getEanData,
	eanStatusUpdate,
	addFreight,
	updateFreight,
	getFreight,
	addItf,
	getVendorList,
	getCurrency,
	getIft,
	getDropdownVendor,
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
	updateItf,
} = require("../controller/setup/setup")

const {
	vendorUpdate,
	addVendor,
	getAllVendor,
	vendorStatusUpdate,
	getDropdownAddressProvinces,
	getDropdownAddressDistrict,
	getDropdownAddressSubDistrict,
	getDropdownPortType,
} = require("../controller/venderManagement/vender")
const {
	purchaseOrderDetails,
	purchaseOrderStatus,
	getDropdownType,
	newAddPurchaseOrder,
	getNewPurchaseOrder,
	newUpdatePurchaseOrder,
	addPurchaseOrderDetails,
	getPurchaseOrderDetails,
	deletePurchaseOrderDetails,
	updatePurchaseOrderDetails,
} = require("../controller/purchaseOrder/purchase")
const {
	getAirline,
	addAirline,
	updateAirline,
	updateAirlineStatus,
} = require("../controller/airline")
const {
	addItfEan,
	addItfPb,
	getItfEan,
	getItfPb,
	deleteItfEan,
	deleteItfPb,
	updateItfEan,
	updateItfPb,
	getItfDetails,
	updateItfDetails,
	addItfDetails,
} = require("../controller/itf/itf")
const { getAllWage, updateWage, addWage } = require("../controller/wage")
const {
	getAllReceving,
	getAllReceving_bp,
	getViewToReceving,
	addReceving,
} = require("../controller/receving")
const {
	getViewToSort,
	addsorting,
	getSorting,
	revertSorting,
} = require("../controller/sorting")
const {
	getToPack,
	addPackingCommon,
	addPackingEan,
	getBrand,
	getPackingCommon,
} = require("../controller/pack")
const {
	getConsignee,
	createConsignee,
	updateConsignee,
} = require("../controller/consignee")
const {
	getAllQuotation,
	addQuotation,
	addQuotationDetails,
	calculateQuotation,
	getQuotationSummary,
	getQuotationDetials,
	deleteQuotationDetials,
	updateQuotationDetails,
	updateQuotation,
	confirmQuotation,
} = require("../controller/quotation")
const {
	getTransportation_Supplier,
	getFreight_Supplier,
	getdropdown_commission_type,
	getChartOfAccounts,
} = require("../controller/view")
const {
	getOrders,
	createOrder,
	updateOrder,
	getOrdersDetails,
	deleteOrderDetails,
	calculateOrder,
	doOrderPacking,
	newCalculateOrder,
	addOrderInput,
	getOrderSummary,
	deleteOrder,
	updateOrderFreight,
	aslWastage,
} = require("../controller/orders")
const { dashboardOpertation } = require("../controller/operation")
const {
	createUnit,
	updateUnit,
	getAllUnit,
	updateUnitStatus,
} = require("../controller/setup/unit")
const {
	addBoxes,
	editBoxes,
	getAllBoxes,
} = require("../controller/setup/boxes")
const {
	createProduce,
	updateProduce,
	getAllProduceItem,
	getSelectProduceItemForEan,
	getDropdownProduceClassification,
} = require("../controller/setup/produce")
const { getEanAvailable } = require("../controller/eanAvaiable")
const {
	getAdjustEanStock,
	getAdjustEanStockById,
	doRepackEan,
} = require("../controller/ean")
const { ExportTest } = require("../controller/pdf/test")
const {
	getAllExpenseItems,
	createExpenseItems,
	updateExpenseItems,
} = require("../controller/expenseitem")
const router = Router()

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/image")
	},
	filename: (req, file, cb) => {
		cb(null, new Date().getTime() + path.extname(file.originalname))
	},
})

const imageFilter = (req, file, cb) => {
	if (
		file.mimetype == "image/png" ||
		file.mimetype == "image/jpg" ||
		file.mimetype == "image/jpeg"
	) {
		cb(null, true)
	} else {
		cb(null, false)
		return cb(new Error("Only .png, .jpg and .jpeg format allowed!"))
	}
}

const upload = multer({
	storage: storage,
	fileFilter: imageFilter,
	limits: { fileSize: 1024 * 1024 * 10 },
})

router.post("/adminLogin", adminLogin)
router.post("/addClient", addClient)
router.get("/getAllClients", getAllClients)
router.post("/updateClientData", updateClientData)
router.get("/getClientDataAsOptions", getClientAsOptions)
router.post("/updateClientStatus", updateClientStatus)

router.post("/createUnit", createUnit)
router.post("/updateUnit", updateUnit)
router.get("/getAllUnit", getAllUnit)
router.post("/updateUnitStatus", updateUnitStatus)
router.post("/createProduce", createProduce)
router.post("/updateProduce", updateProduce)
router.get("/getAllProduceItem", getAllProduceItem)
router.post("/addBoxes", addBoxes)
router.post("/editBoxes", editBoxes)
router.get("/getAllBoxes", getAllBoxes)
router.post("/addPackage", addPackage)
router.post("/updatePackaging", updatePackaging)
router.get("/getAllPackaging", getAllPackaging)
router.post("/addVendor", addVendor)
router.post("/vendorUpdate", vendorUpdate)
router.get("/getAllVendor", getAllVendor)
router.post("/updateVendorStatus", vendorStatusUpdate)
router.post("/clientShipTo", clientShipTo)
router.post("/updateClientShipTo", updateClientShipTo)
router.get("/getShipTo", getShipTo)
router.post("/udpateShipToStatus", updateShipToStatus)
router.post("/addAirport", addAirport)
router.post("/updateAirPort", updateAirPort)
router.post("/updateAirportStatus", updateAirportStatus)
router.get("/getAllAirports", getAllAirports)
router.post("/addBank", addBank)
router.post("/updateBank", updateBank)
router.post("/updateBankStatus", updateBankStatus)
router.get("/getBank", getBank)
router.post("/addClearance", addClearance)
router.post("/updateClearance", updateclearance)
router.post("/updateClearanceStatus", updateClearanceStatus)
router.get("/getClearance", getAllClearance)
router.post("/addTransportation", addTransPort)
router.post("/updateTransportation", updateTransportation)
router.get("/getTransport", getTransportation)

// testing mode (working on later)
router.post("/addEan", addEan)
router.post("/updateEan", updateEan)
router.get("/getEan", getEanData)
router.post("/eanStatus", eanStatusUpdate)

router.get("/getProduceItemForEan", getSelectProduceItemForEan)
router.get("/getPackaginItemForEan", getSelectedPakagingForEan)
router.post("/createEan", createEan)
router.post("/addEanPackaging", upload.none([]), addEanPackaging)
router.post("/addEanProduce", upload.none([]), addEanProduce)
router.post("/getEanPackaging", getEanPackagingData)
router.post("/getEanProduce", getEanProduceData)
router.post("/editEanPackaging", upload.none([]), editEanPackaging)
router.post("/editEanProduce", upload.none([]), editEanProduce)
router.post("/deleteEanPackaging", deleteEanPackaging)
router.post("/deleteEanProduce", deleteEanProduce)
router.post("/editEan", upload.none([]), EditEan)
router.post("/updateEanName", newUpdateEanName)
// testing mode (working on later)
router.post("/addPurchaseOrder", newAddPurchaseOrder)
router.get("/getPurchaseOrder", getNewPurchaseOrder)
router.post("/updatePurchaseOrder", newUpdatePurchaseOrder)
router.post("/getPurchaseDetails", purchaseOrderDetails)
router.post("/updatePodStatus", purchaseOrderStatus)
router.get("/getFreight", getFreight)
router.post("/addFreight", addFreight)
router.post("/updateFreight", updateFreight)
router.post("/addItf", addItf)
router.post("/updateItf", updateItf)
router.get("/getItf", getIft)
router.get("/getVendorList", getVendorList)
router.get("/getCurrency", getCurrency)
router.get("/getDropdownVendor", getDropdownVendor)
router.get(
	"/getDropdownProduceClassification",
	getDropdownProduceClassification,
)
router.get("/getDropdownAddressProvinces", getDropdownAddressProvinces)
router.get("/getDropdownAddressDistrict", getDropdownAddressDistrict)
router.get("/getDropdownAddressSub-district", getDropdownAddressSubDistrict)
router.get("/getDropdownPortType", getDropdownPortType)
router.get("/getDropdownType", getDropdownType)

router.get("/getLocation", setupLocation)
router.post("/createLocation", createSetupLocation)
router.post("/updateLocation", updateSetupLocation)

router.get("/getLiner", getAirline)
router.post("/updateLiner", updateAirline)
router.post("/updateAirlineStatus", updateAirlineStatus)

// ITF

router.post("/addItfEan", addItfEan)
router.post("/addItfPb", addItfPb)
router.post("/getItfEan", getItfEan)
router.post("/getItfPb", getItfPb)
router.post("/deleteItfEan", deleteItfEan)
router.post("/deleteItfPb", deleteItfPb)
router.post("/updateItfEan", updateItfEan)
router.post("/updateItfPb", updateItfPb)

router.post("/addPurchaseOrderDetails", addPurchaseOrderDetails)
router.get("/getPurchaseOrderDetails", getPurchaseOrderDetails)
router.post("/deletePurchaseOrderDetails", deletePurchaseOrderDetails)
router.post("/updatePurchaseOrderDetails", updatePurchaseOrderDetails)

router.get("/getAllWage", getAllWage)
router.post("/updateWage", updateWage)
router.post("/addWage", addWage)

router.get("/getAllReceving", getAllReceving)
router.get("/getAllRecevingBp", getAllReceving_bp)
router.get("/getViewToReceving", getViewToReceving)
router.post("/addReceving", addReceving)

router.get("/getViewToSort", getViewToSort)
router.post("/addsorting", addsorting)
router.get("/getSorting", getSorting)
router.post("/revertSorting", revertSorting)

router.get("/getToPack", getToPack)
router.post("/addPackingCommon", addPackingCommon)
router.post("/addPackingEan", addPackingEan)
router.get("/getBrand", getBrand)
router.post("/getPackingCommon", getPackingCommon)

router.get("/getEanDetails", getEanDeatils)
router.post("/getEanDetailViews", getEanDetailViews)
router.post("/addEanDetails", addEanDetails)
router.post("/updateEanDetails", updateEanDetails)
router.post("/getItfDetails", getItfDetails)
router.post("/getItfDetails", getItfDetails)
router.post("/updateItfDetails", updateItfDetails)
router.post("/addItfDetails", addItfDetails)
router.post("/createEanProducne", createEanProducne)
router.post("/createEanPacking", createEanPacking)

router.get("/getConsignee", getConsignee)

router.get("/getAllQuotation", getAllQuotation)
router.post("/addQuotation", addQuotation)
router.post("/addQuotationDetails", addQuotationDetails)
router.post("/calculateQuotation", calculateQuotation)

router.get("/getTransportation_Supplier", getTransportation_Supplier)

router.get("/getQuotationDetials", getQuotationDetials)
router.get("/getQuotationSummary", getQuotationSummary)
router.get("/deleteQuotationDetials", deleteQuotationDetials)

router.post("/updateQuotationDetails", updateQuotationDetails)
router.post("/updateQuotation", updateQuotation)
router.post("/confirmQuotation", confirmQuotation)
router.get("/getFreight_Supplier", getFreight_Supplier)

router.get("/getDropdownCommissionType", getdropdown_commission_type)
router.post("/createConsignee", createConsignee)
router.post("/updateConsignee", updateConsignee)

router.get("/getOrders", getOrders)
router.post("/createOrder", createOrder)
router.post("/updateOrder", updateOrder)
router.get("/getOrdersDetails", getOrdersDetails)
router.post("/deleteOrderDetails", deleteOrderDetails)

router.post("/calculateOrder", calculateOrder)
router.post("/newCalculateOrder", newCalculateOrder)
router.post("/doOrderPacking", doOrderPacking)
router.get("/dashboardOpertation", dashboardOpertation)
router.post("/addOrderInput", addOrderInput)
router.get("/getOrderSummary", getOrderSummary)
router.post("/deleteOrder", deleteOrder)
router.post("/updateOrderFreight", updateOrderFreight)

router.get("/getEanAvailable", getEanAvailable)
router.post("/aslWastage", aslWastage)
router.get("/getAdjustEanStock", getAdjustEanStock)
router.get("/getAdjustEanStockById", getAdjustEanStockById)
router.post("/doRepackEan", doRepackEan)

router.get("/exportTest", ExportTest)

router.get("/getAllExpenseItems", getAllExpenseItems)
router.post("/createExpenseItems", createExpenseItems)
router.post("/updateExpenseItems", updateExpenseItems)
router.get("/getChartOfAccounts", getChartOfAccounts)
module.exports = router
