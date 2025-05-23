import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from "./routes"
import { Suspense } from "react"

const router = createBrowserRouter(routes)

const App = () => {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
