import localforage from 'localforage';

/**
 * 定义存储类型枚举，用于区分本地存储和会话存储
 */
export type StorageType = 'local' | 'session';

/**
 * 创建一个自定义存储对象
 * @param type 存储类型，可以是本地存储或会话存储
 * @param storagePrefix 存储键的前缀，用于避免键名冲突
 * @returns 返回一个包含存储操作方法的对象
 */
export function createStorage<T extends object>(type: StorageType, storagePrefix: string) {
  // 根据存储类型选择对应的Web存储API
  const stg = type === 'session' ? window.sessionStorage : window.localStorage;

  /**
   * 存储对象，包含set、get、remove和clear方法
   */
  const storage = {
    /**
     * 将数据存储到指定的存储类型中
     * @param key 数据键名
     * @param value 数据值
     */
    set<K extends keyof T>(key: K, value: T[K]) {
      const json = JSON.stringify(value);
      stg.setItem(`${storagePrefix}${key as string}`, json);
    },

    /**
     * 从存储中获取指定键名的数据
     * @param key 数据键名
     * @returns 返回数据值或null，如果数据不存在
     */
    get<K extends keyof T>(key: K): T[K] | null {
      const json = stg.getItem(`${storagePrefix}${key as string}`);
      if (json) {
        let storageData: T[K] | null = null;
        try {
          storageData = JSON.parse(json);
        } catch {}
        if (storageData) {
          return storageData as T[K];
        }
      }

      // 如果数据解析失败，移除存储项
      stg.removeItem(`${storagePrefix}${key as string}`);

      return null;
    },

    /**
     * 从存储中移除指定键名的数据
     * @param key 数据键名
     */
    remove(key: keyof T) {
      stg.removeItem(`${storagePrefix}${key as string}`);
    },

    /**
     * 清空所有存储项
     */
    clear() {
      stg.clear();
    },
  };
  return storage;
}

/**
 * 定义LocalForage类型，扩展自localforage库，限定操作的键值对类型
 */
type LocalForage<T extends object> = Omit<
  typeof localforage,
  'getItem' | 'setItem' | 'removeItem'
> & {
  getItem<K extends keyof T>(
    key: K,
    callback?: (err: any, value: T[K] | null) => void,
  ): Promise<T[K] | null>;

  setItem<K extends keyof T>(
    key: K,
    value: T[K],
    callback?: (err: any, value: T[K]) => void,
  ): Promise<T[K]>;

  removeItem(key: keyof T, callback?: (err: any) => void): Promise<void>;
};

/**
 * 定义Localforage驱动类型枚举，用于选择不同的存储驱动
 */
type LocalforageDriver = 'local' | 'indexedDB' | 'webSQL';

/**
 * 创建一个配置过的Localforage实例
 * @param driver 存储驱动类型，可以是本地存储、IndexedDB或WebSQL
 * @returns 返回配置过的Localforage实例
 */
export function createLocalforage<T extends object>(driver: LocalforageDriver) {
  // 驱动映射，将枚举值映射到localforage库的相应驱动常量
  const driverMap: Record<LocalforageDriver, string> = {
    local: localforage.LOCALSTORAGE,
    indexedDB: localforage.INDEXEDDB,
    webSQL: localforage.WEBSQL,
  };
  // 配置localforage实例的存储驱动
  localforage.config({
    driver: driverMap[driver],
  });

  // 返回配置过的Localforage实例
  return localforage as LocalForage<T>;
}
