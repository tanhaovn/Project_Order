import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./component/Dashboard/Dashboard.jsx";
import Login from "./pages/login/login.jsx";
import SignUpPage from "./pages/signup/signup.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import NewProductCategories from "./component/ProductCategories/NewProductCategories.jsx";
import NewProduct from "./component/Product/NewProduct.jsx";
import NewChooseTable from "./component/Table/NewChooseTable.jsx";
import ProductsPage from "./features/products/ProductsPage.jsx";
import NewChooseOrder from "./component/Order/NewChooseOrder.jsx";
import NewChooseOrderItem from "./component/OrderItem/NewChooseOrderItem.jsx";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "product-categorie",
        element: <NewProductCategories />,
      },
      {
        path: "product-list",
        element: <NewProduct />,
      },
      {
        path: "table",
        element: <NewChooseTable />,
      },
      {
        path: "order-product",
        element: <NewChooseOrder />,
      },
      {
        path: "order-item",
        element: <NewChooseOrderItem />,
      },
      {
        path: "setting",
        element: <div>Setting</div>,
      },
    ],
  },
  {
    path: "/login/*",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-up/*",
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
