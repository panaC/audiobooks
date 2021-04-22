/**
 * Compute utility which makes resulting types easier to read
 * with IntelliSense by expanding them fully, instead of leaving
 * object properties with cryptic type names.
 */
type C<A extends any> = {[K in keyof A]: A[K]} & {};

type T0 = C<{all: string; popular: string; search: string}>; // config.json:root.feed
type T1 = C<{en: string; fr: string}>; // config.json:root.locale.first
type T2 = C<{first: T1}>; // config.json:root.locale
type T3 = C<{get: string; set: string}>; // config.json:root.store
export type T4 = C<{feed: T0; locale: T2; store: T3}>; // config.json:root
