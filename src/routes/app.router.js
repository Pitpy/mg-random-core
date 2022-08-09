const express = require("express");
const router = express.Router();
const { tokenCheck } = require("../middlewares/jwt");
const AppController = require("../controllers/app.controller");

router
  .get("/page/get", tokenCheck, AppController.getPages)
  .get("/page/get/current", tokenCheck, AppController.getPageCurr)
  .post("/page/save/sts", tokenCheck, AppController.savePageSts)
  .post("/page/save/current", tokenCheck, AppController.savePageCurr)
  .post("/customer/save", tokenCheck, AppController.saveCustomer)
  .post("/customer/save/lucky", tokenCheck, AppController.saveLuckyPorson)
  .get("/customer/get", tokenCheck, AppController.getCustomer)
  .get("/customer/get/lucky", tokenCheck, AppController.getLuckyPerson)
  .get("/customer/get/all", tokenCheck, AppController.getCustomerAll)
  .delete("/customer/del/all", tokenCheck, AppController.delCustomerAll)
  .get("/prize/get", tokenCheck, AppController.getPrize)
  .post("/prize/save/sts", tokenCheck, AppController.savePrizeSts)
  .get("/condition/get", tokenCheck, AppController.getCondition)
  .post("/test/save", tokenCheck, AppController.saveTest);

module.exports = router;
