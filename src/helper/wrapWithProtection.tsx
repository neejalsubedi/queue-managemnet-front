import { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

export const wrapWithProtection = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(route => {
    const wrappedRoute = { ...route };

    if (wrappedRoute.element) {
      wrappedRoute.element = (
        <ProtectedRoute>{wrappedRoute.element}</ProtectedRoute>
      );
    }

    if (wrappedRoute.children) {
      wrappedRoute.children = wrapWithProtection(wrappedRoute.children);
    }

    return wrappedRoute;
  });
};
