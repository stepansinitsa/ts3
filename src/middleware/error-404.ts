export = (req: any, res: any) => {
  res.render('../views/error/404', {
    title: 'Ошибка'
  })
}