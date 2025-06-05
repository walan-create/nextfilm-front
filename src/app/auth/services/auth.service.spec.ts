import { AuthResponse } from './../interfaces/auth-response.interface';
import { AuthService } from './auth.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

const baseUrl = environment.baseUrl;

const authResponse1: AuthResponse = {
  token: 'existing-token',
  user: {
    _id: '1',
    email: '',
    name: 'User One',
    isAdmin: false,
  },
};

// const authResponseError: AuthResponse =

fdescribe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  let storage: { [key: string]: string } = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        AuthService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    storage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return storage[key] ?? null;
    });

    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        return (storage[key] = value);
      }
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('checkStatus', () => {
    it('no token in localStorage', () => {
      storage = {}; // Simulate no token in localStorage
      service.checkStatus().subscribe((status) => {
        expect(status).toBeFalse();
      });

      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    describe('with token in localStorage', () => {
      beforeEach(() => {
        storage = { token: 'existing-token' }; // Simulate existing token
      });

      describe('when token is in cache', () => {
        // beforeEach(() => {
        //   service['checkStatusCache'] = new Map<AuthResponse, number>();
        // });

        it('should return true if token is valid', () => {
          const authResponseCopy = { ...authResponse1 };

          service['checkStatusCache'].set(authResponseCopy, Date.now());

          service.checkStatus().subscribe((status) => {
            expect(status).toBeTrue();
          });

          httpMock.expectNone(`${baseUrl}/auth/checkStatus`);

          expect(localStorage.setItem).toHaveBeenCalledWith(
            'token',
            authResponse1.token
          );

          expect(storage['token']).toBe(authResponse1.token);

          expect(service.user()).toEqual(authResponse1.user);
          expect(service.token()).toBe(authResponse1.token);
        });

        it('should go On if token is invalid', () => {
          service['checkStatusCache'].set(authResponse1,
             Date.now() - (15 * 60 * 1000) - 100); //  expired token, hace 15 minutos o más

          service.checkStatus().subscribe((status) => {
            expect(status).toBeTrue();
          });
          expect(localStorage.setItem).not.toHaveBeenCalled();

          //sigue con la peticion
          const req = httpMock.expectOne(`${baseUrl}/auth/checkStatus`);
          expect(req.request.method).toBe('POST');
          req.flush(authResponse1);

          expect(localStorage.setItem).toHaveBeenCalledWith(
            'token',
            authResponse1.token
          );
          expect(storage['token']).toBe(authResponse1.token);
          expect(service.user()).toEqual(authResponse1.user);
          expect(service.token()).toBe(authResponse1.token);
        });
      });

      describe('when token is not in cache', () => {
        it('should return true if token is valid', () => {
          service.checkStatus().subscribe((status) => {
            expect(status).toBeTrue();
          });

          const req = httpMock.expectOne(`${baseUrl}/auth/checkStatus`);
          expect(req.request.method).toBe('POST');
          req.flush(authResponse1);

          expect(localStorage.setItem).toHaveBeenCalledWith(
            'token',
            authResponse1.token
          );
          expect(storage['token']).toBe(authResponse1.token);
        });

        it('should return false if token is invalid', () => {
          const errorResponse = { status: 401, statusText: 'Unauthorized' };

          service.checkStatus().subscribe({
            next: (status) => {
              expect(status).toBeFalse();
            },
            error: () => fail('Expected false return value, not an error'),
          });

          const req = httpMock.expectOne(`${baseUrl}/auth/checkStatus`);
          expect(req.request.method).toBe('POST');
          req.flush(null, errorResponse);

          expect(localStorage.setItem).not.toHaveBeenCalled();
          expect(service.user()).toBeNull();
          expect(service.token()).toBeNull();
        });
      });
    });
  });
});
