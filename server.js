require("dotenv").config();
require('./db/conn');
const userInputModel = require("./db/userInputSchema");

const http = require("http");
const https = require("https");
const url = require("url");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 4000;
const whoisApiKey = process.env.WHOISAPIKEY;

const getRequest = (url) => {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(
          new Error(`API call error, HTTP status code ${res.statusCode}`)
        );
      }
      const data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(data).toString();
        resolve(JSON.parse(resString));
      });
    });
    req.on("error", (e) => reject(`Problem with request: ${e.message}`));
    req.end();
  });
};

const getWebsiteData = async (domainName) => {
  try {
    let data = {};
    const basicInfoApiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${whoisApiKey}&domainName=${domainName}&outputFormat=JSON&ip=1&ignoreRawTexts=1`;
    const dnsInfoApiUrl = `https://www.whoisxmlapi.com/whoisserver/DNSService?apiKey=${whoisApiKey}&domainName=${domainName}&type=_all&outputFormat=JSON`;
    const geoLocationApiUrl = `https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=${whoisApiKey}&domain=${domainName}`;

    const basicInfo = await getRequest(basicInfoApiUrl);
    data = { ...data, ...basicInfo };
    const dnsInfo = await getRequest(dnsInfoApiUrl);
    data = { ...data, ...dnsInfo };
    const geoLocationInfo = await getRequest(geoLocationApiUrl);
    data = { ...data, ...geoLocationInfo };
    return data;
  } catch (err) {
    throw err;
  }
};

const MAIN = async (req, res) => {
  try {
    const reqUrl = url.parse(req.url, true).pathname;
    if (reqUrl === "/get-website-data") {
      const { domainName } = url.parse(req.url, true).query;
      let data = {};
      data = await getWebsiteData(domainName);
      const obj = new userInputModel({ domainName });
      const isInsert = await obj.save();
      if (isInsert) {
        console.log(
          `User input domainName:${domainName} inserted to database.`
        );
      } else {
        console.log(
          `Unable to insert user input domainName:${domainName} in database.`
        );
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } else if(process.env.NODE_ENV === "production") {
      fs.readFile(
        path.resolve(__dirname, "client", "build", "index.html"),
        (err, data) => {
          if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
          }
          res.writeHead(200);
          res.end(data);
        }
      );
    }
  } catch (err) {
    console.log(`Some error occur: ${err}`);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ status: false, message: "Something went wrong!" })
    );
  }
};

if (process.env.NODE_ENV === "production") {
  https
    .createServer(MAIN)
    .listen(PORT, () => console.log(`Node server runnning at ${PORT}`));
} else {
  http
    .createServer(MAIN)
    .listen(PORT, () => console.log(`Node server runnning at ${PORT}`));
}
