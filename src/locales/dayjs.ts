// 导入dayjs的locale方法，用于设置国际化语言
import { locale } from 'dayjs';
// 导入中文（简体）
import 'dayjs/locale/zh-cn';
// 导入英文
import 'dayjs/locale/en';
// 导入本地存储工具
import { localStg } from '@/utils/storage';

/**
 * 设置dayjs的国际化语言
 * @param lang 语言类型，默认为'zh-CN'
 */
export function setDayjsLocale(lang: App.I18n.LangType = 'zh-CN') {
  // 定义语言映射，将应用中的语言类型映射到dayjs支持的语言类型
  const localMap = {
    'zh-CN': 'zh-cn',
    'en-US': 'en',
  } satisfies Record<App.I18n.LangType, string>;

  // 获取语言设置，优先级：传入的参数 > 本地存储的设置 > 默认值'zh-CN'
  const l = lang || localStg.get('lang') || 'zh-CN';

  // 根据语言设置，调用dayjs的locale方法设置国际化语言
  locale(localMap[l]);
}
