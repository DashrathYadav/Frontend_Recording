import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./home/Home";
import Recording from "./recording/Recording";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="/" element={<Home />} />
      <Route path="recording" element={<Recording/>} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
