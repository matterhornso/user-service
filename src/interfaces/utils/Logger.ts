import * as bunyan from "bunyan";
import { LoggingBunyan } from "@google-cloud/logging-bunyan";
export class Logger {
  loggingBunyan: any
  logger: any
  constructor() {
    this.loggingBunyan = new LoggingBunyan({
      projectId: 'carbon-credit',
      keyFilename: 'dist/src/interfaces/utils/carbon-credit-f4e237c3a82e.json'
    });
    this.logger = bunyan.createLogger({
      // The JSON payload of the log as it appears in Cloud Logging
      // will contain "name": "my-service"
      name: 'carbon-credit',
      streams: [
        // Log to the console at 'info' and above
        { stream: process.stdout, level: 'info' },
        // And log to Cloud Logging, logging at 'info' and above
        this.loggingBunyan.stream('info'),
      ],
    });
  }
  async log(log: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.logger.info(log)
    })
  }
}