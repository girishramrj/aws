import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Check if the user is authenticated by looking for the JWT token in localStorage
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expiry) {
        // Token is expired, remove it
        localStorage.removeItem('token');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error parsing token:', error);
      localStorage.removeItem('token');
      return false;
    }
  };
  
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
