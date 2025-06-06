import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ServiceNameServices } from './user.service';
import { environment } from '../../environments/environment';
import { User } from '@auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

const mockUsers: User[] = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'hola',
    isAdmin: false,
  },
  {
    _id: '2',
    name: 'John Poe',
    email: 'adios',
    isAdmin: true,
  },
];

fdescribe('UserService', () => {
  let service: ServiceNameServices;
  let httpMock: HttpTestingController;

  let storage: { [key: string]: string } = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        ServiceNameServices,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(ServiceNameServices);
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


  describe('getAllUsers', () => {
    it('should return all users', () => {
      service.getAllUsers().subscribe((users) => {
        expect(users.length).toBe(2);
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/getUsers`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });
});
