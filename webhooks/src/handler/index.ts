import {TAppService} from 'src';
import listen from './listen';
import player from './player';
import query from './query';
import readMyBook from './readMyBook';
import user from './user';

export default function (appService: TAppService) {
  query(appService);
  listen(appService);
  player(appService);
  readMyBook(appService);
  user(appService);

  return;
}
