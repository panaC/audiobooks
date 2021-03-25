import * as bodyParser from 'body-parser';
import * as express from 'express';

// Import the appropriate service and chosen wrappers
import {conversation, Image, Media} from '@assistant/conversation';
import { configService, localeService } from './di';
import { tryCatch } from './utils/tryCatch';
// https://github.com/actions-on-google/assistant-conversation-nodejs

// Create an app instance
const app = conversation();

// Register handlers for Actions SDK
app.handle('main', async (conv) => {

  const config = await configService.get();
  conv.add(localeService.translate(config.locale?.first, "config.locale.first"));
  conv.add(
    new Image({
      url:
        'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
      alt: 'A cat',
    })
  );

  console.log(conv.user.params);;
  
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.middleware((conv, framework) => {

  console.log('conv.user.locale=', conv.user.locale);
  tryCatch(() => localeService.locale = conv.user.locale.split("-")[0]);

  // conv request
  console.log("CONV DEBUG");
  console.log(conv);
  console.log("==========");
  
  // express
  // console.log(framework);
});

const expressApp = express().use(bodyParser.json());

expressApp.post('/', app);

expressApp.listen(process.env.PORT || 3000);
