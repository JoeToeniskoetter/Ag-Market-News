import AsyncStorage from '@react-native-async-storage/async-storage';

export type CacheItem = {
  [key: string]: CacheItemContent;
};
export type CacheItemContent = {
  val: any;
  initDate: string;
};

export class Cache {
  private cacheExists: boolean = false;
  private cacheObject: CacheItem | null = null;
  constructor(private ttl: number = 0, private namespace: string = 'cache') {
    this.initStorage();
  }

  private async initStorage() {
    let cObj = await AsyncStorage.getItem(this.namespace);
    if (cObj !== null) {
      this.cacheExists = true;
      this.cacheObject = JSON.parse(cObj);
    } else {
      this.cacheObject = {};
      this.saveCacheToStorage();
    }
  }

  private async saveCacheToStorage() {
    await AsyncStorage.setItem(
      this.namespace,
      JSON.stringify(this.cacheObject),
    );
  }

  public remove(key: string): boolean {
    if (!this.cacheObject) {
      return false;
    }
    delete this.cacheObject[key];
    this.saveCacheToStorage();
    return true;
  }

  private isExpired(ci: CacheItemContent): boolean {
    //get date from cache item
    const cachedItemTime = new Date(ci.initDate);
    return (
      Math.abs((cachedItemTime.getTime() - new Date().getTime()) / 1000) >
      this.ttl
    );
  }

  public async get(key: string): Promise<CacheItemContent | null> {
    if (!this.cacheExists || !this.cacheObject) {
      return null;
    }
    const ci: CacheItemContent = this.cacheObject[key] || null;

    if (!ci) {
      return null;
    }

    if (this.isExpired(ci)) {
      this.remove(key);
      return null;
    }

    return this.cacheObject[key];
  }

  public async set(key: string, val: string) {
    const cic: CacheItemContent = {
      val,
      initDate: new Date().toString(),
    };
    if (!this.cacheObject) {
      return;
    }
    this.cacheObject[key] = cic;
    this.saveCacheToStorage();
  }

  public async clear() {
    await AsyncStorage.removeItem(this.namespace);
  }
}
