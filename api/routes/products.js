const express = require("express")
const router = express.Router()

const multer = require("multer")
const checkAuth = require("../middleware/check-auth")
const ProductsController = require("../controllers/products")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("dest")
    cb(null, "./uploads")
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString() + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  console.log("FILE:", file)
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    console.log("IF")
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
})

router.get("/", ProductsController.products_get_all)

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductsController.products_create_product
)

router.get("/:productId", ProductsController.products_get_product)

router.patch(
  "/:productId",
  checkAuth,
  ProductsController.products_update_product
)

router.delete("/:productId", checkAuth, ProductsController.products_delete)

module.exports = router
