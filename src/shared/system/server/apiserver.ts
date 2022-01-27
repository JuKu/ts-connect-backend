import { Request, Response } from "express";

interface ApiServer {
    //
}

class HttpApiServer implements ApiServer {

    private express: any;//: Express.;
    
    public HttpApiServer(express: any) {
        this.express = express;
    }

    public get(endpoint: String, req: Request, res: Response) {
        //
    }
    
}