// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import {nanoid} from 'nanoid';
import * as moment from 'moment';
import {IReadingLink, IWebPubView} from '../interface/webpub';
import {convertContributorArrayToStringArray} from './tools/localisation';

import {Publication as R2Publication} from '@r2-shared-js/models/publication';
import {fallback} from './tools/fallback';
import {convertMultiLangStringToString} from './tools/localisation';
import {OpdsFeedViewConverter} from './opds';

export class WebpubViewConverter {
  opdsFeedViewConverter: OpdsFeedViewConverter;

  constructor(opdsFeedViewConverter = new OpdsFeedViewConverter()) {
    this.opdsFeedViewConverter = opdsFeedViewConverter;
  }
  // Note: PublicationDocument and PublicationView are both Identifiable, with identical `identifier`
  public convertWebpubToView(
    r2Publication: R2Publication,
    baseUrl: string
  ): IWebPubView {
    const title = convertMultiLangStringToString(r2Publication.Metadata.Title);
    const publishers = convertContributorArrayToStringArray(
      r2Publication.Metadata.Publisher
    );
    const authors = convertContributorArrayToStringArray(
      r2Publication.Metadata.Author
    );

    let publishedAt: string | undefined;
    if (r2Publication.Metadata.PublicationDate) {
      publishedAt = moment(
        r2Publication.Metadata.PublicationDate
      ).toISOString();
    }

    const coverLinks = fallback(
      this.opdsFeedViewConverter.convertFilterLinksToView(
        baseUrl,
        r2Publication.Resources,
        {
          type: ['image/png', 'image/jpeg'],
          rel: 'cover',
        }
      ),
      this.opdsFeedViewConverter.convertFilterLinksToView(
        baseUrl,
        r2Publication.Resources,
        {
          type: ['image/png', 'image/jpeg'],
        }
      ),
      this.opdsFeedViewConverter.convertFilterLinksToView(
        baseUrl,
        r2Publication.Resources,
        {
          type: new RegExp('^image/*'),
        }
      )
    );

    const cover = coverLinks.find(v => v.url)?.url;

    const readingOrdersLinks = this.opdsFeedViewConverter.convertFilterLinksToView(
      baseUrl,
      r2Publication.Spine,
      {
        type: ['audio/mpeg'],
      }
    );

    const readingOrders =
      readingOrdersLinks.map<IReadingLink>(l => ({
        duration: l.duration,
        url: l.url,
      })) || [];

    const toc = this.opdsFeedViewConverter.convertOpdsTocToView(
      r2Publication.TOC,
      baseUrl
    );

    return {
      identifier: nanoid(),
      title, // default title
      authors,
      description: r2Publication.Metadata.Description,
      languages: r2Publication.Metadata.Language,
      publishers,
      workIdentifier: r2Publication.Metadata.Identifier,
      publishedAt,
      cover,

      RDFType: r2Publication.Metadata.RDFType,
      duration: r2Publication.Metadata.Duration,
      nbOfTracks: readingOrders.length,

      readingOrders,
      toc,
    };
  }
}
