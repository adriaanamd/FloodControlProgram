import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { extname, isAbsolute, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import startServer from "../dist/server/server.js"

const projectRoot = resolve(fileURLToPath(new URL(".", import.meta.url)), "..")
const clientRoot = resolve(projectRoot, "dist/client")
const host = process.env.HOST ?? "0.0.0.0"
const port = Number(process.env.PORT ?? 3000)

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
}

function staticPath(pathname) {
  let decodedPath
  try {
    decodedPath = decodeURIComponent(pathname)
  } catch {
    return null
  }

  const filePath = resolve(clientRoot, `.${decodedPath}`)
  const relativePath = relative(clientRoot, filePath)
  if (relativePath.startsWith("..") || isAbsolute(relativePath)) return null
  return filePath
}

function requestHeaders(headers) {
  const values = Object.entries(headers).flatMap(([name, value]) => {
    if (value === undefined) return []
    return [[name, Array.isArray(value) ? value.join(", ") : value]]
  })
  return new Headers(values)
}

function writeResponse(response, nodeResponse) {
  nodeResponse.statusCode = response.status
  response.headers.forEach((value, name) => nodeResponse.setHeader(name, value))
  if (nodeResponse.req?.method === "HEAD") {
    nodeResponse.end()
    return
  }
  response
    .arrayBuffer()
    .then((body) => nodeResponse.end(Buffer.from(body)))
    .catch(() => {
      if (!nodeResponse.headersSent) nodeResponse.statusCode = 500
      nodeResponse.end("Internal Server Error")
    })
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(
      request.url ?? "/",
      `http://${request.headers.host ?? `${host}:${port}`}`,
    )
    const filePath =
      requestUrl.pathname === "/" ? null : staticPath(requestUrl.pathname)

    if (filePath) {
      try {
        const body = await readFile(filePath)
        response.statusCode = 200
        response.setHeader(
          "content-type",
          contentTypes[extname(filePath).toLowerCase()] ??
            "application/octet-stream",
        )
        response.setHeader("content-length", body.byteLength)
        if (request.method === "HEAD") response.end()
        else response.end(body)
        return
      } catch {
        // Let TanStack Start handle routes that are not static assets.
      }
    }

    const method = request.method ?? "GET"
    const init = { method, headers: requestHeaders(request.headers) }
    if (method !== "GET" && method !== "HEAD")
      Object.assign(init, { body: request, duplex: "half" })
    const startResponse = await startServer.fetch(new Request(requestUrl, init))
    writeResponse(startResponse, response)
  } catch {
    response.statusCode = 500
    response.end("Internal Server Error")
  }
})

server.listen(port, host, () => {
  console.log(`FloodControl server listening on http://${host}:${port}`)
})
