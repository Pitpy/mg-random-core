// app controller
const db = require("../configs/db.config");

const getPages = (req, res) => {
  db.query(
    `
  SELECT
    p.id,
    p.title,
    p.sts,
    p.path ,
    mp.id prize_id,
    mp.title page_desc
  FROM
    pages p
  JOIN mg_prize mp ON
	  mp.page_id = p.id
  WHERE mp.id = ?
  `,
    [req.query.prize],
    (err, result) => {
      if (err) {
        console.log("getUser", err);
        res.json({
          message: "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້",
          code: 102,
        });
      } else
        res.json({
          code: 101,
          data: result,
          message: "Success!",
        });
    }
  );
};

const getCondition = (req, res) => {
  db.query("select * from mg_conditions", (err, result) => {
    if (err) {
      console.log("getCondition", err);
      res.json({
        message: "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້",
        code: 102,
      });
    } else
      res.json({
        code: 101,
        data: result,
        message: "Success!",
      });
  });
};

const getPageCurr = (req, res) => {
  db.query("select * from page_current", (err, result) => {
    if (err) {
      console.log("getUser", err);
      res.json({
        message: "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້",
        code: 102,
      });
    } else
      res.json({
        code: 101,
        data: result[0]["curr"],
        message: "Success!",
      });
  });
};

const savePageSts = (req, res) => {
  const { page_id, page_sts } = req.body;
  db.query("call sp_save_page_status(?,?)", [page_id, page_sts], (err) => {
    if (err) {
      console.log("getUser", err);
      res.json({
        message: "ບັນທຶກລົ້ມເຫລວ, ກະລຸນາລອງໃຫມ່",
        code: 102,
      });
    } else
      res.json({
        code: 101,
        message: "Success!",
      });
  });
};

const getPrize = (req, res) => {
  db.query(
    "select * from mg_prize where type = ? order by id desc",
    [req.query.type],
    (err, result) => {
      if (err) {
        console.log("getUser", err);
        res.json({
          message: "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້",
          code: 102,
        });
      } else
        res.json({
          code: 101,
          data: result,
          message: "Success!",
        });
    }
  );
};

const savePrizeSts = (req, res) => {
  const { prize_id, prize_sts } = req.body;
  db.query(
    "UPDATE mg_prize SET sts = ? WHERE id = ?",
    [prize_sts, prize_id],
    (err) => {
      if (err) {
        console.log("savePrizeSts", err);
        res.json({
          message: "ບັນທຶກລົ້ມເຫລວ, ກະລຸນາລອງໃຫມ່",
          code: 102,
        });
      } else
        res.json({
          code: 101,
          message: "Success!",
        });
    }
  );
};

const savePageCurr = (req, res) => {
  const { page_curr } = req.body;
  db.query(
    "call sp_save_page_current(?)",
    [JSON.stringify(page_curr)],
    (err) => {
      if (err) {
        console.log("getUser", err);
        res.json({
          message: "ບັນທຶກລົ້ມເຫລວ, ກະລຸນາລອງໃຫມ່",
          code: 102,
        });
      } else
        res.json({
          code: 101,
          message: "Success!",
        });
    }
  );
};

function formatDate(val) {
  if (!val) return null;
  const d = new Date(val).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const [day, month, year, time] = d.split(/[\/,.,-]+/);
  return `${year}-${month}-${day} ${time}`;
}

const saveCustomer = (req, res) => {
  "use strict";
  const items = req.body;
  var data = items.map((item) => [item.id, item.name ?? ""]);
  const sql = `insert into customers (
      id,
      name) values ?`;

  db.query(sql, [data], (err) => {
    if (err) {
      console.log("saveCustomer", err);
      res.json({
        message: "ບັນທຶກລົ້ມເຫລວ, ກະລຸນາລອງໃຫມ່",
        code: 102,
      });
    } else {
      res.json({
        message: "ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ",
        code: 101,
      });
    }
  });
};

const saveTest = (req, res) => {
  "use strict";
  const items = req.body;
  var data = items.map((item) => [item.trans_no]);
  const sql = `insert into test (trans_no) values ?`;
  db.query(sql, [data], (err) => {
    if (err) {
      console.log("saveCustomer", err);
      res.json({
        message: "ບັນທຶກລົ້ມເຫລວ, ກະລຸນາລອງໃຫມ່",
        code: 102,
      });
    } else {
      res.json({
        message: "ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ",
        code: 101,
      });
    }
  });
};

const delCustomerAll = (req, res) => {
  db.query("delete from mg_customers", (err) => {
    if (err) {
      console.log("delCustomerAll", err);
      res.json({
        message: "ລຶບລົ້ມເຫລວ, ກະລຸນາລອງໃຫມ່",
        code: 102,
      });
    } else
      res.json({
        code: 101,
        message: "ລຶບຂໍ້ມູນທັງໝົດສຳເລັດ.",
      });
  });
};

const getCustomer = (req, res) => {
  db.query(
    "select id, name, is_lucky from mg_customers where is_lucky = 'N' and condition_id = ?",
    [req.query.condition],
    (err, result) => {
      if (err) {
        console.log("getCustomer", err);
        res.json({
          message: "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້",
          code: 102,
        });
      } else
        res.json({
          code: 101,
          data: result,
          message: "Success!",
        });
    }
  );
};

const getCustomerAll = (req, res) => {
  db.query("select * from mg_customers", (err, result) => {
    if (err) {
      console.log("getCustomerAll", err);
      res.json({
        message: "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້",
        code: 102,
      });
    } else
      res.json({
        code: 101,
        data: result,
        message: "Success!",
      });
  });
};

const getLuckyPerson = (req, res) => {
  db.query(
    `
    SELECT
      c.id,
      c.name,
      c.is_lucky,
      l.prize_no
    FROM
      lucky_person l
    JOIN mg_customers c 
          ON
      c.id = l.id
    WHERE
      l.prize_no = ?
      AND is_lucky = 'Y'
    ORDER BY
      l.created ASC
    `,
    [req.query.prize_no],
    (err, result) => {
      if (err) {
        console.log("getLuckyPerson", err);
        res.json({
          message: "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້",
          code: 102,
        });
      } else
        res.json({
          code: 101,
          data: result[0],
          message: "Success!",
        });
    }
  );
};

const saveLuckyPorson = (req, res) => {
  const { card_info, prize_no } = req.body;
  var data = card_info.map((item) => [item.id, prize_no]);
  db.query(
    `INSERT INTO lucky_person (id, prize_no) VALUES ?`,
    [data],
    (err) => {
      if (err) {
        console.log("saveLuckyPorson", err);
        res.json({
          message: "ບັນທຶກລົ້ມເຫລວ, ກະລຸນາລອງໃຫມ່",
          code: 102,
        });
      } else
        res.json({
          code: 101,
          message: "Success!",
        });
    }
  );
};

module.exports = {
  getPages,
  getCondition,
  savePageSts,
  getPageCurr,
  savePageCurr,
  saveCustomer,
  getCustomer,
  getCustomerAll,
  delCustomerAll,
  savePrizeSts,
  getPrize,
  saveLuckyPorson,
  getLuckyPerson,
  saveTest,
};
