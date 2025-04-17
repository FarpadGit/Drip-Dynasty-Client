import { Injectable } from '@angular/core';
import axios from 'axios';
import { EnvService } from '../env.service';

// Must be in a singleton service, otherwise axios.create() would create a new AxiosInstance from every service that makes a call
// and the Authorization header would be different for all of them
@Injectable({
  providedIn: 'root',
})
export class AxiosService {
  constructor(private process: EnvService) {}

  callAxios = axios.create({
    baseURL: this.process.env['NG_APP_SERVER_URL'],
    withCredentials: true,
  });

  hasBearer() {
    return this.callAxios.defaults.headers.common['Authorization'] != undefined;
  }

  setBearer(token: string) {
    this.callAxios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }

  revokeBearer() {
    this.callAxios.defaults.headers.common['Authorization'] = undefined;
  }
}
