const express = require("express");
const router = express.Router();

const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController();

router.post("/", cartController.newCart);
router.get("/:cid", cartController.getCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/product/:pid", cartController.deleteProductToCart);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/product/:pid", cartController.updateQuatityProducts);
router.delete("/:cid", cartController.emptyCart);
router.post("/:cid/purchase", cartController.finishBuying);

module.exports = router;