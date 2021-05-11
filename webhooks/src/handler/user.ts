import {TAppService} from '..';

export default function (app: TAppService) {
  app.handle('remove_data', conv => {
    app.storage.store.player = {};
  });
}
