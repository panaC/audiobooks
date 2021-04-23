/**
 * Compute utility which makes resulting types easier to read
 * with IntelliSense by expanding them fully, instead of leaving
 * object properties with cryptic type names.
 */
type C<A extends any> = {[K in keyof A]: A[K]} & {};

type T0 = C<{all: string; popular: string; search: string}>; // config.json:root.feed
type T1 = C<{en: string; fr: string}>; // config.json:root.locale.query_select_publication_first, config.json:root.locale.query_select_publication_second, config.json:root.locale.read_toc, config.json:root.locale.read_toc_no_response
type T2 = C<{
  query_select_publication_first: T1;
  query_select_publication_second: T1;
  read_toc: T1;
  read_toc_no_response: T1;
}>; // config.json:root.locale
type T3 = C<{get: string; set: string}>; // config.json:root.store
export type T4 = C<{feed: T0; locale: T2; store: T3}>; // config.json:root
