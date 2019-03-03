import {HttpLibrary, RequestContext, ResponseContext} from './http';
import * as e6p from 'es6-promise'
e6p.polyfill();
import 'isomorphic-fetch';

export class IsomorphicFetchHttpLibrary implements HttpLibrary {

    public send(request: RequestContext): Promise<ResponseContext> {
        let method = request.httpMethod.toString();
        let body: string | FormData = "";
        if (typeof request.body === "string") {
            body = request.body;
        } else {
            body = new FormData();
            for (const key in request.body) {
                body.append(key, request.body[key].value);
            }
        }
        
        return fetch(request.url, {
            method: method,
            body: body,
            headers: request.headers,
            credentials: "same-origin"
        }).then((resp) => {
            // hack
            let headers = (resp.headers as any)._headers;
            for (let key in headers) {
                headers[key] = (headers[key] as Array<string>).join("; ");
            }

            return resp.text().then((body) => {
                return new ResponseContext(resp.status, headers, body)
            });
        });

    }
}