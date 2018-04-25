import { Promise } from "core-js";

export class Fetch {


  execute(): Promise<Array<any>> {
    return fetch('https://api.github.com/orgs/lemoncode/members')
      .then((response) => this.checkStatus(response))
      .then((response) => this.parseJSON(response)
        .then((response) => { return Promise.resolve(this._parse(response)) })
        .catch((error) => this.throwError(error))
      );
  }

  private checkStatus(response: Response): Promise<Response> {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      let error = new Error(response.statusText);
      throw error;
    }
  }

  private parseJSON(response: Response): Promise<Response> {
    return response.json();
  }

  private _parse(data) {
    return data;
  }

  private throwError(error) {
    document.write("<p>Ops! something wrong! We are so embarrased..</p>");
    console.log(error);
    return Promise.reject(error);
  }
}