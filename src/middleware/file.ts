import multer from 'multer'

const storage = multer.diskStorage({
  destination(req: any, file: any, cb: any){
    cb(null, 'api/books')
  },
  filename(req: any, file: any, cb: any){
    cb(null, `${Date.now()} ${file.originalname}`)
  }
})

export = multer({storage})