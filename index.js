/**
 * Bismillah Arrahman Arrahim
 * Author: Luqman B Shariffudin (Man Sarip) twitter: luqmanrasa
 */
const axios = require("axios");

const toyyibPay = {
  /**
   * Get Bank API is useful for you to get bank information which are accepted to be used with Toyyibpay. Bank information is required when you create a user from API. Ref: https://toyyibpay.com/apireference/#gb
   * @param {object} options - Options
   * @param {boolean} options.dev - Tentukan endpoint domain. Jika 'true', maka library akan connect dengan 'dev.toyyibpay.com'. jika 'false', library ini akan connect dengan production 'toyyibpay.com'. (Default = 'false')
   * @returns {array} Bank information in JSON format.
   */
  async getBank(options = {}) {
    const { dev } = options;

    try {
      const res = await axios({
        method: "get",
        url: baseUrl(dev) + "/getBank"
      });

      return res.data;
    } catch (e) {
      return `Error: Unable to get bank list (${properErrorMessage(e)})`;
    }
  },

  /**
   * Get Bank FPX API is useful for you to get bank code which are accepted to be used with Toyyibpay. Bank code is required when you need to use runBill API. Ref: https://toyyibpay.com/apireference/#gbf
   * @param {object} options - Options
   * @param {boolean} options.dev - Tentukan endpoint domain. Jika 'true', maka library akan connect dengan 'dev.toyyibpay.com'. jika 'false', library ini akan connect dengan production 'toyyibpay.com'. (Default = 'false')
   * @param {boolean} options.withStatus - Dapatkan status bank dalam dedicated key. (Default = 'false')
   * @returns {array} Bank information in JSON format.
   */
  async getBankFPX(options = {}) {
    const { dev, withStatus } = options;

    try {
      const res = await axios({
        method: "get",
        url: baseUrl(dev) + "/getBankFPX"
      });

      if (withStatus === true) {
        let clone = [];

        for (const bank of res.data) {
          if (bank.NAME.match("(Offline)")) {
            clone.push({ ...bank, STATUS: "OFFLINE", IS_ONLINE: false });
          } else {
            clone.push({ ...bank, STATUS: "ONLINE", IS_ONLINE: true });
          }
        }

        return clone;
      }

      return res.data;
    } catch (e) {
      return `Error: Unable to get bank fpx list (${properErrorMessage(e)})`;
    }
  },

  /**
   * Get Package API is useful for you to get package information which are provided in Toyyibpay. Package information is required when you create a user from API. Ref: https://toyyibpay.com/apireference/#gp
   * @param {object} options - Options
   * @param {boolean} options.dev - Tentukan endpoint domain. Jika 'true', maka library akan connect dengan 'dev.toyyibpay.com'. jika 'false', library ini akan connect dengan production 'toyyibpay.com'. (Default = 'false')
   * @returns {array} Package information in JSON format.
   */
  async getPackage(options = {}) {
    const { dev } = options;

    try {
      const res = await axios({
        method: "get",
        url: baseUrl(dev) + "/getPackage"
      });

      return res.data;
    } catch (e) {
      return `Error: Unable to get package list (${properErrorMessage(e)})`;
    }
  },

  /**
   * (For Enterprise Account Only) This API will show how to create Toyyibpay user from API. This API will return User Secret Key which later will be used for creating Category and Bill. Ref: https://toyyibpay.com/apireference/#cu
   * @param {object} options - Options
   * @param {boolean} options.dev - Tentukan endpoint domain. Jika 'true', maka library akan connect dengan 'dev.toyyibpay.com'. jika 'false', library ini akan connect dengan production 'toyyibpay.com'. (Default = 'false')
   * @param {string} options.fullname - User full name
   * @param {string} options.user name - User name to access or login
   * @param {string} options.email - User Email OR User Id (not necessary in email format)
   * @param {string} options.password - User Password
   * @param {string} options.phone - User Phone
   * @param {string} options.bank - User Bank Selection
   * @param {string} options.accountNo - User Bank Account No
   * @param {string} options.accountHolderName - User Account Holder Name
   * @param {string} options.registrationNo - User Company / Business / Organization Registration No
   * @param {string} options.package - User Package
   * @param {string} options.following - Enterprise User Secret Key
   * @returns {array} User Secret Key in JSON format. It will return error if the email already exist.
   */
  async createUser(options = {}) {
    const {
      dev,
      fullname,
      username,
      email,
      password,
      phone,
      bank,
      accountNo,
      accountHolderName,
      registrationNo,
      package,
      following
    } = options;

    try {
      const res = await axios({
        method: "post",
        url: baseUrl(dev) + "/createAccount",
        data: {
          fullname: fullname || "",
          username: username || "",
          email: email || "",
          password: password || "",
          phone: phone || "",
          bank: bank || "",
          accountNo: accountNo || "",
          accountHolderName: accountHolderName || "",
          registrationNo: registrationNo || "",
          package: package || "",
          following: following || ""
        }
      });

      return res.data;
    } catch (e) {
      return `Error: Unable to create user (${properErrorMessage(e)})`;
    }
  },

  /**
   * (For Enterprise Account Only) You may check user account status by submitting user email and enterprise user secret key. Ref: https://toyyibpay.com/apireference/#gus
   * @param {object} options - Options
   * @param {boolean} options.dev - Tentukan endpoint domain. Jika 'true', maka library akan connect dengan 'dev.toyyibpay.com'. jika 'false', library ini akan connect dengan production 'toyyibpay.com'. (Default = 'false')
   * @param {string} options.username - Username
   * @param {string} options.enterpriseUserSecretKey - Enterprise user secret key
   * @returns {array} User information.
   */
  async getUserStatus(options = {}) {
    const { dev, username, enterpriseUserSecretKey } = options;

    try {
      const res = await axios({
        method: "post",
        url: baseUrl(dev) + "/getUserStatus",
        data: {
          username: username || "",
          enterpriseUserSecretKey: enterpriseUserSecretKey || ""
        }
      });

      if (res.data.length > 0) {
        let desc = {
          "0": "Inactive",
          "1": "New-Pending Approval",
          "2": "Active"
        };

        let currentInfo = res.data[0];
        let status = res.data[0].status;

        return [
          {
            ...currentInfo,
            description: desc[status]
          }
        ];
      }

      return res.data;
    } catch (e) {
      return `Error: Unable to get user status (${properErrorMessage(e)})`;
    }
  },

  /**
   * Check all user account information by submitting partner type and user secret key. Ref: https://toyyibpay.com/apireference/#gau
   * @param {object} options - Options
   * @param {boolean} options.dev - Tentukan endpoint domain. Jika 'true', maka library akan connect dengan 'dev.toyyibpay.com'. jika 'false', library ini akan connect dengan production 'toyyibpay.com'. (Default = 'false')
   * @param {string} options.userSecretKey - Secret key for OEM or Enterprise user.
   * @param {string} options.partnerType - Valid values "OEM" | "ENTERPRISE"
   * @returns {array} Bank information in JSON format.
   */
  async getUserStatus(options = {}) {
    const { dev, userSecretKey, partnerType } = options;

    try {
      const res = await axios({
        method: "post",
        url: baseUrl(dev) + "/getUserStatus",
        data: {
          userSecretKey: userSecretKey || "",
          partnerType: partnerType || ""
        }
      });

      return res.data;
    } catch (e) {
      return `Error: Unable to get all user info (${properErrorMessage(e)})`;
    }
  }
};

function baseUrl(isDev) {
  const PROD_URL = "https://toyyibpay.com";
  const DEV_URL = "https://dev.toyyibpay.com";
  let url = isDev ? DEV_URL : PROD_URL;
  url += "/index.php/api";
  return url;
}

function properErrorMessage(e) {
  // toyyibPay tak return proper error message :(
  // jadi kita stick pada error code saja lah dulu.
  // sebenarnya ada, tapi toyyibPay bagi "\t\t\t\t" sahaja. Hmm? Come on team toyyib ;)
  // return e.response ? e.response.data : e.message;
  return e.message;
}

toyyibPay
  .getBank({ dev: true, fullname: "Luqman" })
  .then(res => console.log(res));
