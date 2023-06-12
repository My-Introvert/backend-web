import argon2 from "argon2";
import dotenv from "dotenv";
import Users from "../models/UserModel.js";

dotenv.config();

const imageName = process.env.IMAGE_DEFAULT_USER;
const urlImageDefault = `${process.env.APP_PROTOCOL_BE + process.env.APP_HOSTNAME_BE + ":" + process.env.APP_PORT_BE}/images/users/${imageName}`;

// ================ Default Account =====================
const accountAdmin = {
  firstName: "Admin",
  lastName: "Demo",
  email: "admin@gmail.com",
  password: await argon2.hash("123456"),
  confPassword: await argon2.hash("123456"),
  role: "admin",
  label: "not-label",
  image: imageName,
  urlImage: urlImageDefault,
};
const accountUser = {
  firstName: "User",
  lastName: "Demo",
  email: "user@gmail.com",
  password: await argon2.hash("123456"),
  confPassword: await argon2.hash("123456"),
  role: "user",
  label: "not-label",
  image: imageName,
  urlImage: urlImageDefault,
};

// ============ Insert Data to Table =================
const InsetDataToTable = async (table, value) => {
  try {
    await table.sync();
    await table.create(value);
    console.log(`Account default "${value.firstName}" telah dibuat....`);
  } catch (error) {
    console.log(`Terjadi kesalahan : ${error.message}`);
  }
};
setTimeout(() => {
  console.log("Data Sync has been created successfully");
  console.log("Tekan [ CTRL + C ] untuk keluar");
}, 3000);

InsetDataToTable(Users, accountAdmin);
InsetDataToTable(Users, accountUser);
