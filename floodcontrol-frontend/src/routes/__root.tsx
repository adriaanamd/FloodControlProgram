import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import styles from "../app/styles/index.css?url"

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "stylesheet", href: styles },
      { rel: "icon", href: "/favicon.svg" },
    ],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "iFlood 2.0 | City Operations" },
      {
        name: "description",
        content: "Mock flood operations dashboard for San Isidro City.",
      },
    ],
    scripts: [],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
