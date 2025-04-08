import fs from "fs"
import os from "os"

export = (req: any, res: any, next: any) => {
  const now = Date.now()
  const { url, method } = req
  const data = `${now} ${method} ${url}`

  fs.appendFile("server.log", data + os.EOL, (err: any) => {
    if (err) throw err;
  })

  next()
}