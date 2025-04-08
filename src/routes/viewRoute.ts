import { Router } from 'express';
const router = Router();
import fileMiddleware from '../middleware/file'
import { getCounter, setCounter } from './counterReq'
import container from '../container'
import BooksRepository from '../BookRepository'

router.get('/view', async (_req: any, res: any) => {
  try {
    const repo: any = container.get(BooksRepository)
    const books = await repo.getBooks()
    res.render('books/index', { title: "Список книг", books: books });
  } catch (e) {
    res.status(404).redirect('../views/error/404');
  };
});


router.get('/view/:id', async (req: any, res: any) => {
  const { id } = req.params
  try {
    const repo: any = container.get(BooksRepository)
    const book = await repo.getBooks(id)
    if (!book) {
      getCounter(id, (resp: any) => {
        if (resp.statusCode !== 500) {
          resp.on('data', (d: any) => {
            const count = JSON.parse(d).count;
            console.log(`Запрос прошел успешно, cnt - ${count}`);
            res.render('books/view', {
              title: 'Выбранная книга', book: book, count: count
            });
          });
          setCounter(id);
        };
      });
    };
  } catch (e) {
    res.status(404).redirect('../views/error/404');
  };
});


router.get('/create', (_req: any, res: any) => {
  res.render('books/create', { title: 'Добавить книгу', book: {} });
});

router.post('/create', fileMiddleware.single('file'), async (req: any, res: any) => {
  const { title, authors, description, favorite, fileCover, fileName } = req.body
  const fileBook = req.file ? req.file : null

  try {
    const repo: any = container.get(BooksRepository)
    const book = await repo.createBook({ title, authors, description, favorite, fileCover, fileName, fileBook })
    await book.save();
    res.redirect("/books/view")
  } catch (e) {
    res.status(404)
    res.redirect('../views/error/404');
  };
});

router.get('/update/:id', async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const repo: any = container.get(BooksRepository)
    const book = await repo.getBooks(id)
    res.render('books/update', {
      title: 'Редактировать книгу',
      book: book,
    });
  } catch {
    res.status(404).redirect('../views/error/404');
  };
});

router.post('/update/:id', fileMiddleware.single('file'), async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const { title, authors, description, favorite, fileCover, fileName } = req.body;
    const fileBook = req.file ? req.file : null;
    const repo: any = container.get(BooksRepository);
    const book = await repo.getBook(id);
    await book.findByIdAndUpdate(id, { title, description, authors, favorite, fileCover, fileName, fileBook });
    res.status(200).redirect('/books/view/' + id);
  } catch {
    res.status(404).redirect("../views/error/404");
  }
})

router.post('/delete/:id', async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const repo: any = container.get(BooksRepository)
    await repo.deleteOne({ _id: id });
    res.status(200).redirect("/books/view");
  } catch {
    res.status(404).redirect("../views/error/404");
  };
});
export default router;