import express, { Response as ExResponse, Request as ExRequest } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import onFinished from "on-finished";
import swaggerUi from "swagger-ui-express";
import logger from './logger/logger';
import { Logger } from "../interfaces/utils/Logger";
const cors = require('cors');
import * as client from 'prom-client';
// Create Express server
const router = express();
router.disable("x-powered-by");
dotenv.config({
  path: path.resolve(__dirname, `../env/${process.env.ENVIRONMENT}.env`)
});

// Express configuration
router.set("port", process.env.PORT || 3000);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors({
  // Allowed origins come from CORS_ORIGINS (comma-separated) when set, falling
  // back to the historical hardcoded list. Hardcoding meant every new
  // environment needed a code change and a redeploy to be reachable at all,
  // which is why the production domain was never in the list.
  origin: (process.env.CORS_ORIGINS || "https://shine-uat.nseindia.com,https://nse-dev.shinetrace.space,http://localhost:3000,http://localhost:3700")
    .split(",").map((o) => o.trim()).filter(Boolean)
}));


// Create a Registry which registers the metrics
const register = new client.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'user-service'
})

// Enable the collection of default metrics
client.collectDefaultMetrics({ register })

router.get("/", function (req, res, next) {
  logger.debug("route, new request path " + req.path);
  return res.status(200).json({ status: "user service is Working!" });
});

router.get("/user", function (req, res, next) {
  logger.debug("route, new request path " + req.path);
  return res.status(200).json({ status: "user service is Working!" });
});

router.get("/healthz", function (req, res, next) {
  logger.debug("route, new request path " + req.path);
  return res.status(200).json({ status: "user service is health is good Working!" });
});

router.get("/livez", function (req, res, next) {
  logger.debug("route, new request path " + req.path);
  return res.status(200).json({ status: "user service livez!" });
});

router.get("/readyz", function (req, res, next) {
  logger.debug("route, new request path " + req.path);
  // readyState 1 === connected. Report NOT ready without a live DB so k8s
  // keeps traffic away instead of routing it into guaranteed 500s.
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: "not ready: database unavailable" });
  }
  return res.status(200).json({ status: "ready" });
});

router.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../../api/dist/swagger.json"))
  );
});


router.use(async function (req, res: any, next) {
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks: Uint8Array[] | Buffer[] = [];

  res.write = (...restArgs: any) => {
    chunks.push(Buffer.from(restArgs[0]));
    oldWrite.apply(res, restArgs);
  };

  res.end = (...restArgs: any) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString('utf8');

    // console.log({
    //   time: new Date().toUTCString(),
    //   fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    //   method: req.method,
    //   originalUri: req.originalUrl,
    //   uri: req.url,
    //   requestData: req.body,
    //   responseData: body,
    //   referer: req.headers.referer || '',
    //   ua: req.headers['user-agent']
    // });

    //console.log(body);
    // new Logger().log({
    //   time: new Date().toUTCString(),
    //   fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    //   method: req.method,
    //   originalUri: req.originalUrl,
    //   uri: req.url,
    //   uuid:req.headers._user_uuid || '',
    //   jwtToken:req.headers.authorization || '',
    //   requestData: req.body,
    //   responseData: "data sent",
    //   referer: req.headers.referer || '',
    //   ua: req.headers['user-agent']
    // })
    oldEnd.apply(res, restArgs);
  };

  next();
});

export default router;
