const express = require("express")
const router = express.Router()

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET test",
  })
})

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "POST test",
  })
})

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId

  if (id === "special") {
    res.status(200).json({
      message: "special ID",
    })
  } else {
    res.status(200).json({
      message: "normal ID",
    })
  }
})

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Updated product",
  })
})

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "deleted product",
  })
})

module.exports = router
