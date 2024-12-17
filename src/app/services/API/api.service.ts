import { Injectable } from '@angular/core';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private errorFn = (error: AxiosError) => {
    let errorMessage = null;
    switch (error.response?.status) {
      case 401:
        errorMessage = {
          401: 'Request denied. You need to authenticate with the server first.',
        };
        break;
      case 404:
        errorMessage = { 404: 'Requested item not found.' };
        break;
      default:
        errorMessage = { 500: 'An unkown error happened on the server' };
        break;
    }
    return { error: errorMessage };
  };

  private callAxios = axios.create({
    baseURL: import.meta.env['NG_APP_SERVER_URL'],
    withCredentials: true,
  });

  async makeRequest(url: string, options?: AxiosRequestConfig<any>) {
    return this.callAxios(url, options)
      .then((res: AxiosResponse) => res.data)
      .catch(this.errorFn);
  }

  async makeFormRequest(
    url: string,
    method: 'POST' | 'PUT',
    formData: FormData
  ) {
    if (method === 'POST')
      return this.callAxios
        .post(url, formData)
        .then((res: AxiosResponse) => res.data)
        .catch(this.errorFn);
    if (method === 'PUT')
      return this.callAxios
        .put(url, formData)
        .then((res: AxiosResponse) => res.data)
        .catch(this.errorFn);
  }

  hasBearer() {
    return this.callAxios.defaults.headers.common['Authorization'] != undefined;
  }

  setBearer(token: string) {
    this.callAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }

  revokeBearer() {
    this.callAxios.defaults.headers.common['Authorization'] = undefined;
  }

  async checkCredentials() {
    const response = await this.makeRequest('/auth/enticate');
    if (!response.error) return true;
    return false;
  }

  login(username: string, password: string) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      data: { username, password },
    });
  }

  resetDB() {
    return this.makeRequest('/resetDB', {
      method: 'POST',
    });
  }
}
