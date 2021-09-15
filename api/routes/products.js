const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const multer = require("multer")
const checkAuth = require("../middleware/check-auth")

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

const Product = require("../models/product")

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map(({ name, price, _id, productImage }) => {
          return {
            name,
            price,
            productImage,
            _id,
            request: { type: "GET", url: "Http://localhost:3000/" + _id },
          }
        }),
      }
      res.status(200).json(response)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

router.post("/", checkAuth, upload.single("productImage"), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  })
  product
    .save()
    .then(({ name, price, _id }) => {
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name,
          price,
          _id,
          request: { type: "GET", url: "Http://localhost:3000/" + _id },
        },
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        })
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

router.patch("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }

  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

router.delete("/:productId", checkAuth, (req, res, next) => {
  const id = req.params.productId
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) =>
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" },
        },
      })
    )
    .catch((err) => {
      res.status(500).json({ error: err })
    })
})

module.exports = router
