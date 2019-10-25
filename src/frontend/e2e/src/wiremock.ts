let jswiremocklib = require('jswiremock');

export class Wiremock {
    jswiremock;

    constructor() {
        this.jswiremock = new jswiremocklib.jswiremock(9999, 'json'); //note the port here matches the port in the baseUrl
    }

    stop() {
        this.jswiremock.stopJSWireMock();
    }

    get(url: string, body: object) {
        jswiremocklib.stubFor(this.jswiremock, jswiremocklib.get(jswiremocklib.urlEqualTo(url))
            .willReturn(jswiremocklib.a_response()
                .withStatus(200)
                .withHeader({ "Content-Type": "application/json" })
                .withBody(JSON.stringify(body))));
    }

    post(url: string, requestBody: object, responseCode: number, body: object) {
        jswiremocklib.stubFor(this.jswiremock, jswiremocklib.post(jswiremocklib.urlEqualTo(url))
            .willReturn(jswiremocklib.a_response()
                .withStatus(200)
                .withHeader({ "Content-Type": "application/json" })
                .withBody(JSON.stringify(body))));
    }

    verifyPost(url: string, body: object){
        return this.jswiremock.verify(1, jswiremocklib.post(jswiremocklib
            .urlEqualTo(url), body));
    }
}