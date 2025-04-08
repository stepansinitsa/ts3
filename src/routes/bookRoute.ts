import { Router } from 'express';
const router = Router();
import fileMulter from '../middleware/file';
import { BookModel } from '../models/Book';
import container from '../container';
import BooksRepository from '../BookRepository';

router.get('/', async (req, res) => {
  try {
    const repo: BooksRepository = container.get(BooksRepository);
    const books = await repo.getBooks();
    res.status(200).json(books).redirect('/books/view');
  } catch (e) {
    res.status(404).redirect('../views/error/404');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const repo: any = container.get(BooksRepository);
    const book = await repo.getBooks(id);
    res.status(200).json(book);
  } catch (e) {
    res.json('404 | Cтраница не найдена');
  }
});

router.get('/:id/download', async (req, res) => {
  const { id } = req.params;
  try {
    const repo: any = container.get(BooksRepository);
    let book = await repo.getBooks(id);
    if (!req.file) {
      res.json(null);
      return;
    }
    const { path } = req.file;
    book = {
      ...book,
      fileBook: path,
    };
    await book.save();
  } catch (e) {
    res.json('404 | Книга не найдена');
  }
});

router.post('/:id/upload', fileMulter.single('file'), async (req, res) => {
  const { id } = req.params;
  try {
    const repo: any = container.get(BooksRepository);
    let book = await repo.getBooks(id);
    if (!req.file) {
      res.json(null);
      return;
    }
    const { path } = req.file;
    book = {
      ...book,
      fileBook: path,
    };
    await book.save();
  } catch (e) {
    res.status(404);
    res.json('404 | Ошибка загрузки');
  }
});

router.post('/', async (req, res) => {
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;
  const newBook = new BookModel({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  });
  try {
    const repo = container.get(BooksRepository);
    const book = await repo.createBook(newBook);
    await book.save();
    res.status(201).json(book);
  } catch (e) {
    res.status(404);
    res.json('404 | Ошибка загрузки');
  }
});

router.put('/:id', async (req, res) => {
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;
  const { id } = req.params;
  try {
    const repo: any = container.get(BooksRepository);
    const book = await repo.getBook(id);
    await book.findByIdAndUpdate(id, {
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook,
    });
    res.redirect(`/api/books/${id}`);
  } catch (e) {
    res.status(404);
    res.json('404 | Cтраница не найдена');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const repo: any = container.get(BooksRepository);
    await repo.deleteOne({ _id: id });
    res.status(200).send('deleted');
  } catch (e) {
    res.status(404);
    res.json('404 | Cтраница не найдена');
  }
});

export default router;
