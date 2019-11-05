// Type defined by feihua

/** 提供符合 TARS 日志的基础类 */
export const TarsBase: any

/** 提供按大小输出的滚动日志 */
export const TarsRotate: any

/** 提供按日期输出的日志 */
export const TarsDate: any

/** 输出至远程日志 (方舟数据中间件) */
export const TarsRemote: any

export interface FormatterOptions {
  /** 日志内容项与项之间的分隔符. 默认值为 `|` */
  separ?: string
}

/** 提供了符合 Tars 日志格式标准的内容格式化方法 */
export namespace Formatter {
  export interface LogFormatter {
    (options?: any): string
  }

  export function Detail (options?: FormatterOptions): LogFormatter
  export function Simple (options?: FormatterOptions): LogFormatter
}

/** 定义了与时间相关日志滚动的处理方法 */
export namespace DateFormat {
  export interface BaseDateFormat {
    logPattern: string
    name: string
    interval?: number
    timePattern?: string
  }

  export type BaseDateFormatConstructor = new (...args: any[]) => BaseDateFormat

  /** 按 1 天日志 */
  export const LogByDay: new (interval?: number, pattern?: string) => BaseDateFormat

  /** 按 1 小时日志 */
  export const LogByHour: new (interval?: number, pattern?: string) => BaseDateFormat

  /** 按 10 分钟日志 */
  export const LogByMinute: new (interval?: number, pattern?: string) => BaseDateFormat

  /** 自定义格式日志 */
  export const LogByCustom: new (pattern: string) => BaseDateFormat
}