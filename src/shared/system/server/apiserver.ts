import {Request, Response} from "express";

/**
 * interface for api server.
 *
 * @author Justin Kuenzel
 */
export interface ApiServer {
    //
}

/**
 * An implementation for the api server.
 * This class is responsible for registering new api endpoints.
 *
 * @author Justin Kuenzel
 */
export class HttpApiServer implements ApiServer {
  private express: any;// : Express.;

  /**
   * default constructor.
   * @constructor
   * @param {any} express instance of express application
   */
  HttpApiServer(express: any) {
    this.express = express;
  }

  /**
   * register a GET endpoint.
   * @param {Stirng} endpoint the endpoint url, e.q. "/api/my-endpoint"
   * @param {Function} fn the function which has to be executed on
   * this endpoint
   */
  public get(endpoint: string, fn: (req: Request, res: Response) => any) {
    this.express.get(endpoint, fn);
  }
}
