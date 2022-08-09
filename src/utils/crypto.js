const CryptoJS = require("crypto-js");
const bcrypt = require("bcryptjs");

const Crypto = () => {};

Crypto.encrypt = (messageToencrypt) => {
  if (messageToencrypt) {
    var encryptedMessage = CryptoJS.AES.encrypt(
      messageToencrypt,
      process.env.SECRET_KEY_ENC
    );
    return encryptedMessage.toString();
  } else {
    return null;
  }
};

Crypto.decrypt = (encryptedMessage) => {
  if (encryptedMessage) {
    var decryptedBytes = CryptoJS.AES.decrypt(
      encryptedMessage,
      process.env.SECRET_KEY_ENC
    );
    var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
  } else {
    return null;
  }
};

Crypto.hash = (text) => {
  const salt = bcrypt.genSaltSync(10);
  if (text) {
    return bcrypt.hashSync(text, salt);
  } else {
    return null;
  }
};

module.exports = Crypto;
