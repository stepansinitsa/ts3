import BookRepository from './BookRepository';
import 'reflect-metadata';
import { Container, decorate, injectable } from 'inversify';

const container = new Container();

decorate(injectable(), BookRepository);
container.bind(BookRepository).to(BookRepository).inSingletonScope();

export default container;
