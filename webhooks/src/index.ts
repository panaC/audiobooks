import * as bodyParser from 'body-parser';
import * as express from 'express';

// Import the appropriate service and chosen wrappers
import {conversation, Image} from '@assistant/conversation';
import {i18n} from './di';
// https://github.com/actions-on-google/assistant-conversation-nodejs

// Create an app instance
const app = conversation();

// Register handlers for Actions SDK
app.handle('main', conv => {
  conv.add(i18n.__('main.home.message', 'test'));
  conv.add(
    new Image({
      url:
        'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
      alt: 'A cat',
    })
  );
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.middleware((conv, framework) => {
  i18n.setLocale(conv.user.locale || 'fr-FR');

  console.log('i18n set locale ', i18n.getLocale(), conv.user.locale);

  // conv request
  // console.log(conv);
  // express
  // console.log(framework);
});

const expressApp = express().use(bodyParser.json());

expressApp.post('/', app);

expressApp.listen(process.env.PORT || 3000);
