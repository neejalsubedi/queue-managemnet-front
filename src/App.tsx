import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useMemo } from "react";
import { useDynamicRoutes } from "./routes/routes";

const App = () => {
  const routes = useDynamicRoutes();

  const router = useMemo(() => createBrowserRouter(routes), [routes]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
