import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-red-600">404 - Page Not Found</h1>
      <p className="text-lg mb-6 text-center">
        We're sorry, but the page you are trying to access could not be found. It might have been removed, renamed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <p className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
          Return to Homepage
        </p>
      </Link>
    </div>
    </>
  );
}
 
export default ErrorPage;