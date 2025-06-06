import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { of } from 'rxjs';
import { User } from '@auth/interfaces/user.interface';
import { Component, signal } from '@angular/core';

class AuthServiceMock {
  checkStatus = jasmine.createSpy('checkStatus').and.callFake(() => {
    return of(true);
  });
  user = signal({
    _id: '1',
    email: 'test@test.com',
    name: 'Test User',
    isAdmin: false,
  } as User);
}

@Component({ template: '' })
class DummyLandingComponent {}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        provideHttpClientTesting(),
        provideRouter([
          { path: '', component: HeaderComponent},
          { path: 'landing', component: DummyLandingComponent},
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Check Status Resource', () => {
    it('should load checkStatusResource correctly', async () => {
      expect(authService.checkStatus).toHaveBeenCalled();

      // Esperar a que se resuelva el recurso
      await fixture.whenStable();

      const result = component.checkStatusResource.value();
      expect(result).toBe(true);
    });
  });

  it('should update current route', async () => {
  component.ngOnInit();
  expect(component.currentRoute()).toBe('/');

  await router.navigateByUrl('/landing');
  fixture.detectChanges();

  expect(component.currentRoute()).toBe('/landing');
});
});
