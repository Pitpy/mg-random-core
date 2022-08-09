const db = require("../configs/db.config");
const crypto = require("../utils/crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function genToken(data, no) {
    let token = jwt.sign(
        {
            user_id: data.user,
            uid: data.uid,
        },
        no == 1 ? process.env.RE_TOKEN_SECRET : process.env.ACC_TOKEN_SECRET,
        {
            expiresIn: no == 1 ? "24h" : "8h",
        },
        {
            algorithm: "RS256",
        }
    );

    return token;
}

function myMsg(status) {
    if (status == "Y")
        return 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ';
    else if (status == "N")
        return 'ຜູ້ໃຊ້ລະບົບນີ້ຖືກປິດແລ້ວ';
    else return "ຊື່ຜູ້ໃຊ້ນີ້ບໍ່ມີໃນລະບົບ";
}

function genUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
    );
    return uuid;
}

const Login = (req, res, next) => {
    const { user, password } = req.body;
    db.query(
        "select id, uname, pwd, is_active from users where id = ?",
        [user],
        (err, result) => {
            if (err) {
                console.log("Login", err);
                res.json({
                    message: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້', code: 102
                });
            }
            else if (result[0]) {
                const data = result[0];
                const isPass = bcrypt.compareSync(crypto.decrypt(password), data.pwd);
                if (isPass && data.is_active == "Y") {
                    req.user_id = data.id;
                    next();
                } else
                    res.json({
                        code: 99,
                        message: myMsg(data.is_active),
                    });
            } else {
                res.json({
                    code: 99,
                    message: myMsg(null),
                });
            }
        }
    );
};

const loginHistory = (req, res) => {
    const head = req.headers;
    const uuid = head.uid || genUID();
    const reToken = genToken({ user: req.user_id, uid: uuid }, 1);
    const accToken = genToken({ user: req.user_id, uid: uuid }, 2);

    db.query(
        "call sp_auth_save_history(?,?,?)",
        [req.user_id, uuid, reToken],
        (err) => {
            if (err) {
                console.log("loginHistory", err);
                res.json({
                    message: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້', code: 102
                });
            }
            else {
                res.json({
                    code: 101,
                    message: "Authenticated",
                    token: crypto.encrypt(accToken),
                    uid: uuid,
                });
            }
        }
    );
};

const Initial = (req, res, next) => {
    const { uid } = req.body;
    if (!uid)
        return res.json({
            code: 103,
            message: "Initialize failed",
        });
    db.query(
        "select user_id, token from login_history where uid = ? and is_logout = 'N'",
        [uid],
        (err, result) => {
            if (err) {
                console.log("Initial", err);
                res.json({
                    message: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້', code: 102
                });
            }
            else {
                if (result[0]) {
                    const { token, user_id } = result[0];
                    if (token)
                        jwt.verify(token, process.env.RE_TOKEN_SECRET, (err) => {
                            if (err) {
                                req.decoded = {
                                    user_id: user_id,
                                    uid: uid,
                                };
                                req.body = {
                                    desc: 'Token Expired'
                                }
                                next();
                            } else {
                                const accToken = genToken({ user: user_id, uid: uid }, 2);
                                res.json({
                                    code: 101,
                                    message: "Authenticated",
                                    token: crypto.encrypt(accToken),
                                    uid: uid,
                                });
                            }
                        });
                } else {
                    res.json({
                        code: 103,
                        message: "Session expired",
                    });
                }
            }
        }
    );
};

const getUser = (req, res) => {
    db.query(
        "select id, uname from users where id = ?",
        [req.decoded.user_id],
        (err, result) => {
            if (err) {
                console.log('getUser', err);
                res.json({
                    message: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້', code: 102
                });
            }
            else
                res.json({
                    code: 101,
                    data: result[0],
                    message: "Success!",
                });
        }
    );
};

const Logout = (req, res) => {
    const { user_id, uid } = req.decoded;
    const { desc } = req.body
    db.query("call sp_auth_logout(?,?,?)", [user_id, uid, desc], (err) => {
        if (err) {
            console.log('Logout', err);
            res.json({ message: "Logout failed", code: 102 });
        }
        else
            res.json({
                code: 105,
                message: "Logged out!",
            });
    });
};

module.exports = {
    Login,
    loginHistory,
    Initial,
    getUser,
    Logout,
};
