import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { of } from 'rxjs';
import { User } from '@auth/interfaces/user.interface';
import { Component, signal } from '@angular/core';
import { AppLayoutComponent } from './app-layout.component';

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

describe('AppLayoutComponent', () => {
  let fixture: ComponentFixture<AppLayoutComponent>;
  let component: AppLayoutComponent;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLayoutComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        provideHttpClientTesting(),
        provideRouter([
          { path: '', component: AppLayoutComponent},
          { path: 'landing', component: DummyLandingComponent},
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppLayoutComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Updating routes', () => {

    it('should update current route', async () => {
    component.ngOnInit();
    expect(component.currentRoute()).toBe('/');

    await router.navigateByUrl('/landing');
    fixture.detectChanges();

    expect(component.currentRoute()).toBe('/landing');
  });
  });

});
