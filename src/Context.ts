var cloneDeep = require("lodash.clonedeep");
var logger = require("./util/Logger");
var CryptoJS = require("crypto-js");
var serviceConfig = process.env.npm_config_service || "./configuration";
const globalService = require(serviceConfig);

export class Context {
  service: any;
  page: any;
  data: any;

  constructor(req: any) {
    this.service = cloneDeep(globalService);
    this.service.hash = hashCode(this.service.name);
    logger.debug("service hash : " + this.service.hash);
    this.data = this.getDataFromReq(req);
    logger.debug("this.data after cookie : " + JSON.stringify(this.data));

    const pageId = req.params["page"] || this.service.firstPage;
    this.page = this.service.pages.find((page: any) => page.id === pageId);

    req.body && Object.keys(req.body).forEach(key => (this.data[key] = req.body[key]));

    logger.debug("this.data after fields: " + JSON.stringify(this.data));
  }

  getEncodedData() {
    return this.encode(this.data, this.service.cookieSecret);
  }

  getDataFromReq(req: any) {
    if (this.service.hash in req.cookies) {
      logger.debug("we have a service cookie");
      var encrypted = req.cookies[this.service.hash];
      logger.debug("encrypted cookie : " + encrypted);
      var decrypted = this.decode(encrypted, this.service.cookieSecret);
      logger.debug("decrypted cookie : " + decrypted);
      return decrypted;
    }
    return {};
  }

  encode(obj: any, secret: string) {
    if (process.env.npm_config_debug == "true") {
      return JSON.stringify(obj);
    }
    logger.debug(`encoding : ${JSON.stringify(obj)} with ${secret}`);
    return CryptoJS.AES.encrypt(JSON.stringify(obj), secret).toString();
  }

  decode(str: string, secret: string) {
    if (process.env.npm_config_debug == "true") {
      return JSON.parse(str);
    }
    var bytes = CryptoJS.AES.decrypt(str, secret);
    var asString = bytes.toString(CryptoJS.enc.Utf8);
    logger.debug("decoded to string: " + asString);
    return JSON.parse(asString);
  }

  isValid() {
    if (!this.page) {
      logger.info("context invalid : no page found");
      return false;
    }

    if (!this.page.preRequisiteData) {
      return true;
    }
    logger.info(`page ${this.page.id} has pre-requisite data`);
    return this.page.preRequisiteData.every(key => {
      logger.info(`key ${key} in data? ` + JSON.stringify(this.data));
      return key in this.data;
    });
  }
}

function hashCode(str: string) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var character = str.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
