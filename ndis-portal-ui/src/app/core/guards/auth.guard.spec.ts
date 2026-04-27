/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard - Protected Routes', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: jasmine.createSpy('isAuthenticated'),
            getToken: jasmine.createSpy('getToken'),
          },
        },
        {
          provide: Router,
          useValue: {
            parseUrl: jasmine.createSpy('parseUrl').and.returnValue('/login'),
          },
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('TC-A09: Access protected page without token', () => {
    it('Should redirect to login when accessing /services without token', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);
      (authService.getToken as jasmine.Spy).and.returnValue(null);

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      const result = AuthGuard(mockRoute, mockState);

      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.parseUrl).toHaveBeenCalledWith('/login');
    });

    it('Should redirect to login when accessing /bookings without token', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);

      const mockRoute = {} as any;
      const mockState = { url: '/bookings' } as any;

      const result = AuthGuard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalledWith('/login');
    });

    it('Should deny access when token is not in localStorage', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      AuthGuard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalled();
    });

    it('Should return UrlTree (redirect) when not authenticated', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);
      (router.parseUrl as jasmine.Spy).and.returnValue('/login' as any);

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      const result = AuthGuard(mockRoute, mockState);

      expect(result).toBeTruthy();
      expect(router.parseUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('Authenticated Access', () => {
    it('Should allow access to /services when authenticated', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(true);
      (authService.getToken as jasmine.Spy).and.returnValue('test-token');

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      const result = AuthGuard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should allow access to /bookings when authenticated', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(true);

      const mockRoute = {} as any;
      const mockState = { url: '/bookings' } as any;

      const result = AuthGuard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should allow access to all protected routes when authenticated', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(true);

      const protectedRoutes = ['/services', '/bookings', '/services/1', '/book-new'];

      protectedRoutes.forEach((route) => {
        const mockRoute = {} as any;
        const mockState = { url: route } as any;

        const result = AuthGuard(mockRoute, mockState);

        expect(result).toBe(true);
      });
    });
  });

  describe('Token Expiration', () => {
    it('Should redirect to login if token becomes invalid', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      AuthGuard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('Multiple Protected Routes', () => {
    it('Should protect /services route', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      AuthGuard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalled();
    });

    it('Should protect /bookings route', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);

      const mockRoute = {} as any;
      const mockState = { url: '/bookings' } as any;

      AuthGuard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalled();
    });

    it('Should protect /book-new route', () => {
      (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);

      const mockRoute = {} as any;
      const mockState = { url: '/book-new' } as any;

      AuthGuard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalled();
    });
  });
});
