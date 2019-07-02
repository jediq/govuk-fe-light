var cloneDeep = require("lodash.clonedeep");
var logger = require("./util/Logger");
var CryptoJS = require("crypto-js");

const globalService = require("./configuration");

export class Context {
  service: any;
  page: any;
  data: any;

  constructor(req: any) {
    this.service = cloneDeep(globalService);
    this.service.hash = hashCode(this.service.name);
    logger.info("service hash : " + this.service.hash);

    const pageId = req.params["page"] || this.service.firstPage;
    this.page = this.service.pages.find((page: any) => page.id === pageId);

    this.data = this.getDataFromReq(req);
    logger.info("this.data after cookie : ", this.data);

    req.body && Object.keys(req.body).forEach(key => (this.data[key] = req.body[key]));

    logger.info("this.data after fields: ", this.data);
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
    logger.debug(`encoding : ${obj} with ${secret}`);
    return CryptoJS.AES.encrypt(JSON.stringify(obj), secret).toString();
  }

  decode(str: string, secret: string) {
    var bytes = CryptoJS.AES.decrypt(str, secret);
    logger.debug("decoded into bytes: " + bytes);
    var asString = bytes.toString(CryptoJS.enc.Utf8);
    logger.debug("decoded to string: " + asString);
    return JSON.parse(asString);
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
