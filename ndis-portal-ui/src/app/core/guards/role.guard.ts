import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional Guard to protect role-based routes.
 * It checks if the user has the required role to access a route.
 *
 * Usage: canActivate: [RoleGuard(['Coordinator', 'Admin'])]
 */
export const RoleGuard: (allowedRoles: string[]) => CanActivateFn =
  (allowedRoles: string[]) => (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getRole();
    console.log('RoleGuard checking... URL:', state.url);
    console.log('User role:', userRole);
    console.log('Allowed roles:', allowedRoles);

    if (!userRole) {
      console.log('RoleGuard: No role found, redirecting to /login');
      return router.parseUrl('/login');
    }

    if (allowedRoles.includes(userRole)) {
      console.log('RoleGuard: ALLOW access');
      return true;
    }

    console.log('RoleGuard: DENY access, insufficient permissions');
    // Redirect to a "not authorized" page or services page
    return router.parseUrl('/services');
  };
