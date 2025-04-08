import { Router } from 'express';
const router = Router();

router.get('/', (req: any, res: any) => {
  res.render('index', {title: 'Главная страница'})
});

export default router;