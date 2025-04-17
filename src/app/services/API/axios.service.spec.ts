import { TestBed } from '@angular/core/testing';

import { AxiosService } from './axios.service';
import { EnvService } from '../env.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('AxiosService', () => {
  let service: AxiosService;
  let mockAxios: MockAdapter;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    mockAxios.reset();

    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_SERVER_URL: '' },
    });

    TestBed.configureTestingModule({
      providers: [{ provide: EnvService, useValue: envSpy }],
    });
    service = TestBed.inject(AxiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authorization header', () => {
    it('should be able to set Authorization header', () => {
      expect(service.hasBearer()).toBeFalse();

      const response = service.setBearer('test123');

      expect(service.hasBearer()).toBeTrue();
    });

    it('should be able to revoke Authorization header', () => {
      service.setBearer('test123');
      expect(service.hasBearer()).toBeTrue();

      service.revokeBearer();
      expect(service.hasBearer()).toBeFalse();
    });
  });
});
