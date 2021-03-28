export class LocaleService<TLocale extends string> {
  private _locale: TLocale;
  private _localeList: TLocale[];

  constructor(defaultLocale: TLocale, localeList: TLocale[]) {
    this._locale = defaultLocale;
    this._localeList = localeList;
  }

  set locale(l: string) {
    if (this.isLocale(l)) {
      this._locale = l;
    }
  }

  public translate(
    t: Record<string, string> | undefined,
    backupMessage?: string
  ): string {
    const text = t ? t[this._locale] : undefined;
    return text || backupMessage || '';
  }

  private isLocale = (l: string): l is TLocale => {
    return this._localeList.includes(l as TLocale);
  };
}
