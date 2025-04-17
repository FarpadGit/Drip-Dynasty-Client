import { TestBed } from '@angular/core/testing';

import { APIService } from './api.service';
import { AxiosService } from './axios.service';
import { mockInvalidUser, mockValidUser } from '../../../test/mocks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('APIService', () => {
  let service: APIService;
  let mockAxios: MockAdapter;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    mockAxios.reset();
    mockAxios
      .onPost('/fakeEndpointForFormData', jasmine.any(FormData))
      .reply(200, 'form data recieved (post)')
      .onPut('/fakeEndpointForFormData', jasmine.any(FormData))
      .reply(200, 'form data recieved (put)')
      .onPost('/auth/login', {
        username: mockValidUser.username,
        password: mockValidUser.password,
      })
      .reply(200, true)
      .onPost('/auth/login', {
        username: mockInvalidUser.username,
        password: mockInvalidUser.password,
      })
      .reply(200, false)
      .onPost('/resetDB')
      .reply(200, 'resetDB called');

    TestBed.configureTestingModule({
      providers: [AxiosService],
    });
    service = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('makeFormRequest', () => {
    it('should be able to send form data via POST', async () => {
      const response = await service.makeFormRequest(
        '/fakeEndpointForFormData',
        'POST',
        new FormData()
      );

      expect(response).toBe('form data recieved (post)');
    });

    it('should be able to send form data via PUT', async () => {
      const response = await service.makeFormRequest(
        '/fakeEndpointForFormData',
        'PUT',
        new FormData()
      );

      expect(response).toBe('form data recieved (put)');
    });
  });

  describe('checkCredentials', () => {
    it('should be able to authenticate user', async () => {
      mockAxios.onGet('/auth/enticate').reply(200, true);

      const response = await service.checkCredentials();

      expect(response).toBeTrue();
    });

    it('should be able to deny authentication', async () => {
      mockAxios.onGet('/auth/enticate').reply(401);

      const response = await service.checkCredentials();

      expect(response).toBeFalse();
    });
  });

  describe('login', () => {
    it('should be able to login user with correct credentials', async () => {
      const response = await service.login(
        mockValidUser.username,
        mockValidUser.password
      );

      expect(response).toBeTrue();
    });
    it('should deny login from user with bad credentials', async () => {
      const response = await service.login(
        mockInvalidUser.username,
        mockInvalidUser.password
      );

      expect(response).toBeFalse();
    });
  });

  it('should make a call to resetDB endpoint', async () => {
    const response = await service.resetDB();

    expect(response).toBe('resetDB called');
  });
});
