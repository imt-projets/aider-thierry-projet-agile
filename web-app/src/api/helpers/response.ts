interface ResponseData {
    ok : boolean,
    status : number,
    statusText : string
    data : null
    meta : object
}

export class ResponseHelper implements ResponseData {
    
    ok: boolean;
    status: number;
    statusText: string;
    data: null;
    meta: object;

    constructor(isOk : boolean, status: number, statusText: string, data = null, meta = {} ){
        this.ok = isOk
        this.status = status
        this.statusText = statusText
        this.data = data
        this.meta = meta
    }
}