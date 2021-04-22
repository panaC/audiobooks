import {TAppService} from 'src';
import listen from './listen';
import player from './player';
import query from './query';

export default function (appService: TAppService) {
  query(appService);
  listen(appService);
  player(appService);

  return;
}
