/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'mocha';

import {env} from 'process';
import {ActionsOnGoogleTestManager} from '@assistant/conversation-testing';

const DEFAULT_LOCALE = 'fr-FR';
const DEFAULT_SURFACE = 'PHONE';
const CONTINUE_CONVO_PROMPT =
  "Bienvenue dans l'application d'écoute de livres audio";

const PROJECT_ID = env['PROJECT_ID'] || '';
const TRIGGER_PHRASE = 'Parler avec audiobooks';

console.log(PROJECT_ID);

// tslint:disable:only-arrow-functions

describe('My Action Test Suite', function () {
  // Set the timeout for each test run to 60s.
  this.timeout(60000);
  let test: ActionsOnGoogleTestManager;

  async function startConversation() {
    await test.sendQuery(TRIGGER_PHRASE);
    test.assertSpeech(CONTINUE_CONVO_PROMPT);
    test.assertText(CONTINUE_CONVO_PROMPT);
    test.assertIntent('actions.intent.MAIN');
    // test.assertScene('Prompts');
  }

  before('before all', async () => {
    // Load project settings to read project ID and trigger phrase.
    test = new ActionsOnGoogleTestManager({projectId: PROJECT_ID});
    await test.writePreviewFromDraft();
    test.setSuiteLocale(DEFAULT_LOCALE);
    test.setSuiteSurface(DEFAULT_SURFACE);
  });

  afterEach('post test cleans', async () => {
    test.cleanUpAfterTest();
  });

  it('trigger only', async () => {
    await startConversation();
    // await test.sendStop();
    test.assertConversationEnded();
  });
});
