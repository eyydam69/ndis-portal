/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('RoleGuard - Role-Based Access Control', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            getRole: jasmine.createSpy('getRole'),
          },
        },
        {
          provide: Router,
          useValue: {
            parseUrl: jasmine.createSpy('parseUrl').and.returnValue('/services'),
          },
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('TC-A10: Participant accesses coordinator page', () => {
    it('Should deny access when participant tries to access coordinator page', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      const result = guard(mockRoute, mockState);

      expect(authService.getRole).toHaveBeenCalled();
      expect(router.parseUrl).toHaveBeenCalledWith('/services');
    });

    it('Should redirect to /services when participant lacks permissions', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');
      (router.parseUrl as jasmine.Spy).and.returnValue('/services' as any);

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      const result = guard(mockRoute, mockState);

      expect(result).toBeTruthy();
      expect(router.parseUrl).toHaveBeenCalledWith('/services');
    });

    it('Should deny access denied status for insufficient permissions', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      const result = guard(mockRoute, mockState);

      expect(result).not.toBe(true);
    });
  });

  describe('Coordinator Access', () => {
    it('Should allow coordinator to access coordinator routes', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Coordinator');

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should allow coordinator to access participant routes', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Coordinator');

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      const guard = RoleGuard(['Participant', 'Coordinator']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });
  });

  describe('Participant Access', () => {
    it('Should allow participant to access participant routes', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      const guard = RoleGuard(['Participant']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should allow participant to access routes open to all users', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');

      const mockRoute = {} as any;
      const mockState = { url: '/profile' } as any;

      const guard = RoleGuard(['Participant', 'Coordinator']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should deny participant access to admin-only routes', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');

      const mockRoute = {} as any;
      const mockState = { url: '/admin' } as any;

      const guard = RoleGuard(['Admin']);
      const result = guard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalled();
    });
  });

  describe('No Role', () => {
    it('Should redirect to login when user has no role', () => {
      (authService.getRole as jasmine.Spy).and.returnValue(null);

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      guard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalledWith('/login');
    });

    it('Should redirect to login when role is undefined', () => {
      (authService.getRole as jasmine.Spy).and.returnValue(undefined);

      const mockRoute = {} as any;
      const mockState = { url: '/services' } as any;

      const guard = RoleGuard(['Participant']);
      guard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('Multiple Allowed Roles', () => {
    it('Should allow first role in allowed list', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Coordinator');

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator', 'Admin', 'SuperAdmin']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should allow middle role in allowed list', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Admin');

      const mockRoute = {} as any;
      const mockState = { url: '/admin' } as any;

      const guard = RoleGuard(['Coordinator', 'Admin', 'SuperAdmin']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should allow last role in allowed list', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('SuperAdmin');

      const mockRoute = {} as any;
      const mockState = { url: '/super-admin' } as any;

      const guard = RoleGuard(['Coordinator', 'Admin', 'SuperAdmin']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should deny role not in allowed list', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');

      const mockRoute = {} as any;
      const mockState = { url: '/admin' } as any;

      const guard = RoleGuard(['Coordinator', 'Admin', 'SuperAdmin']);
      guard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalled();
    });
  });

  describe('Case Sensitivity', () => {
    it('Should handle role comparison correctly', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Coordinator');

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });

    it('Should be case-sensitive in role comparison', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('coordinator');

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      guard(mockRoute, mockState);

      // Should deny access because of case mismatch
      expect(router.parseUrl).toHaveBeenCalled();
    });
  });

  describe('Route Protection', () => {
    it('Should protect dashboard route from participants', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      guard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalledWith('/services');
    });

    it('Should protect admin route from non-admins', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Participant');

      const mockRoute = {} as any;
      const mockState = { url: '/admin' } as any;

      const guard = RoleGuard(['Admin']);
      guard(mockRoute, mockState);

      expect(router.parseUrl).toHaveBeenCalled();
    });

    it('Should allow coordinator access to coordinator-only routes', () => {
      (authService.getRole as jasmine.Spy).and.returnValue('Coordinator');

      const mockRoute = {} as any;
      const mockState = { url: '/dashboard' } as any;

      const guard = RoleGuard(['Coordinator']);
      const result = guard(mockRoute, mockState);

      expect(result).toBe(true);
    });
  });
});
