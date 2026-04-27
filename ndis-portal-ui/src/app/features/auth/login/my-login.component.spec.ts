/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MyLoginComponent } from './my-login.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('MyLoginComponent - Authentication Test Cases', () => {
  let component: MyLoginComponent;
  let fixture: ComponentFixture<MyLoginComponent>;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLoginComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(MyLoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ===== VALIDATION TESTS =====
  describe('Validation Tests', () => {
    it('TC-A03: Should show error when email is empty', () => {
      component.email = '';
      component.password = 'validpass123';
      component.onLogin();
      expect(component.errorMessage).toContain('Email and password are required');
    });

    it('TC-A03: Should show error when password is empty', () => {
      component.email = 'test@gmail.com';
      component.password = '';
      component.onLogin();
      expect(component.errorMessage).toContain('Email and password are required');
    });

    it('TC-A04: Should show error for invalid email format', () => {
      component.email = 'notanemail';
      component.password = 'validpass123';
      component.onLogin();
      expect(component.errorMessage).toContain('Please enter a valid Gmail email address');
    });

    it('TC-A05: Should show error for password less than 8 characters', () => {
      component.email = 'test@gmail.com';
      component.password = 'abc';
      component.onLogin();
      expect(component.errorMessage).toContain('Password must be at least 8 characters');
    });

    it('Should validate email format with multiple invalid formats', () => {
      const invalidEmails = [
        'test@yahoo.com',
        'user@domain.com',
        'notanemail',
        'test@',
        '@gmail.com',
      ];

      invalidEmails.forEach((email) => {
        component.email = email;
        component.password = 'validpass123';
        component.onLogin();
        expect(component.errorMessage).toBeTruthy();
      });
    });
  });

  // ===== LOGIN TESTS =====
  describe('TC-A06: Login with correct credentials', () => {
    it('Should return 200 and store token on successful login', (done: DoneFn) => {
      spyOn(authService, 'login');
      spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

      component.email = 'test@gmail.com';
      component.password = 'password123';
      component.onLogin();

      const req = httpMock.expectOne((request) =>
        request.url.includes('/api/auth/login')
      );
      expect(req.request.method).toBe('POST');

      req.flush({
        status: 200,
        message: 'Login successful',
        token: 'test-jwt-token',
        user: {
          id: 1,
          role: 'Participant',
        },
      });

      expect(authService.login).toHaveBeenCalledWith('test-jwt-token', '1', 'test@gmail.com', 'Participant');
      expect(router.navigate).toHaveBeenCalledWith(['/services']);
    });

    it('Should be loading while request is pending', (done: DoneFn) => {
      component.email = 'test@gmail.com';
      component.password = 'password123';

      component.onLogin();
      expect(component.isLoading).toBe(true);

      const req = httpMock.expectOne((request) =>
        request.url.includes('/api/auth/login')
      );

      req.flush({
        status: 200,
        message: 'Login successful',
        token: 'test-jwt-token',
        user: { id: 1, role: 'Participant' },
      });

      setTimeout(() => {
        expect(component.isLoading).toBe(false);
        done();
      }, 100);
    });
  });

  // ===== LOGIN ERROR TESTS =====
  describe('TC-A07: Login with wrong password', () => {
    it('Should return 401 and show error message for wrong password', (done: DoneFn) => {
      component.email = 'test@gmail.com';
      component.password = 'wrongpassword123';
      component.onLogin();

      const req = httpMock.expectOne((request) =>
        request.url.includes('/api/auth/login')
      );

      req.flush(
        { status: 401, message: 'Invalid email or password' },
        { status: 401, statusText: 'Unauthorized' }
      );

      setTimeout(() => {
        expect(component.errorMessage).toContain('Incorrect email or password');
        expect(component.isLoading).toBe(false);
        done();
      }, 100);
    });
  });

  describe('TC-A08: Login with non-existent email', () => {
    it('Should return 401 and show error message for non-existent email', (done: DoneFn) => {
      component.email = 'nonexistent@gmail.com';
      component.password = 'password123';
      component.onLogin();

      const req = httpMock.expectOne((request) =>
        request.url.includes('/api/auth/login')
      );

      req.flush(
        { status: 401, message: 'Invalid email or password' },
        { status: 401, statusText: 'Unauthorized' }
      );

      setTimeout(() => {
        expect(component.errorMessage).toContain('Incorrect email or password');
        expect(component.isLoading).toBe(false);
        done();
      }, 100);
    });
  });

  // ===== NETWORK ERROR TESTS =====
  describe('Network and Server Error Handling', () => {
    it('Should handle 500 server error', (done: DoneFn) => {
      component.email = 'test@gmail.com';
      component.password = 'password123';
      component.onLogin();

      const req = httpMock.expectOne((request) =>
        request.url.includes('/api/auth/login')
      );

      req.flush({ status: 500, message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });

      setTimeout(() => {
        expect(component.errorMessage).toContain('Server error');
        done();
      }, 100);
    });

    it('Should handle 503 service unavailable error', (done: DoneFn) => {
      component.email = 'test@gmail.com';
      component.password = 'password123';
      component.onLogin();

      const req = httpMock.expectOne((request) =>
        request.url.includes('/api/auth/login')
      );

      req.flush({ status: 503, message: 'Service Unavailable' }, { status: 503, statusText: 'Service Unavailable' });

      setTimeout(() => {
        expect(component.errorMessage).toContain('Service temporarily unavailable');
        done();
      }, 100);
    });

    it('Should handle network errors (status 0)', (done: DoneFn) => {
      component.email = 'test@gmail.com';
      component.password = 'password123';
      component.onLogin();

      const req = httpMock.expectOne((request) =>
        request.url.includes('/api/auth/login')
      );

      req.error(new ProgressEvent('error'), { status: 0 });

      setTimeout(() => {
        expect(component.errorMessage).toBeTruthy();
        done();
      }, 100);
    });
  });

  // ===== UI STATE TESTS =====
  describe('UI State and Error Display', () => {
    it('Should display error message below footer text', () => {
      component.errorMessage = 'Test error message';
      fixture.detectChanges();

      const errorElement = fixture.debugElement.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Test error message');
    });

    it('Should clear error message on new login attempt', () => {
      component.errorMessage = 'Previous error';
      component.email = 'test@gmail.com';
      component.password = 'password123';
      component.onLogin();

      expect(component.errorMessage).toBe('');
    });

    it('Should disable login button while loading', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector('.btn-login');
      expect(button.disabled).toBe(true);
    });

    it('Should show loading text on button while loading', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector('.btn-login');
      expect(button.textContent).toContain('Logging in...');
    });
  });
});
