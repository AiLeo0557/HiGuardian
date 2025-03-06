type TupleTypeGuardConfig<T extends any[]> = {
  [Index in keyof T]: (value: unknown) => value is T[Index]
};
/**
 * author: 杜朝辉
 * date: 2025-02-19
 * description: 创建元组守卫
 * @param config - 元组类型验证配置数组（每个元素对应元组位置的类型验证函数）
 * @param requiredIndices - 可选参数，必选元素的索引数组（默认所有元素必选）
 * @returns 类型守卫函数
 */
export function createTupleTypeGuard<T extends any[]>(
  config: TupleTypeGuardConfig<T>,
  requiredIndices: number[] = Array.from({ length: config.length }, (_, i) => i) // 默认所有索引必选
): (tuple: unknown) => tuple is T {
  // 参数预处理
  const maxAllowedIndex = config.length - 1
  const processedIndices = [...new Set(requiredIndices)] // 去重
    .sort((a, b) => a - b)

  // 校验索引合法性
  processedIndices.forEach(index => {
    if (index < 0 || index > maxAllowedIndex) {
      throw new Error(
        `Invalid required index ${index}. Valid range: 0-${maxAllowedIndex}`
      )
    }
  })

  // 计算最小长度（基于最大必选索引）
  const minLength = processedIndices.length > 0
    ? Math.max(...processedIndices) + 1
    : 0

  return (tuple: unknown): tuple is T => {
    try {
      // 基础类型检查
      if (!Array.isArray(tuple)) {
        throw new Error("Input is not an array")
      }

      // 长度范围检查
      if (tuple.length < minLength || tuple.length > config.length) {
        throw new Error(
          `Invalid tuple length. Required ${minLength}-${config.length}, got ${tuple.length}`
        )
      }

      // 必选元素存在性检查
      processedIndices.forEach(index => {
        if (index >= tuple.length || tuple[index] === undefined) {
          throw new Error(`Required element at index ${index} is missing`)
        }
      })

      // 类型校验
      return tuple.every((element, index) => {
        const validator = config[index]
        // 当前索引非必选,并当前项为 undefined 则跳过校验
        // if (!processedIndices.includes(index) && isUndefined(element)) {
        //   return true
        // }
        return validator?.(element) ?? false // 允许超长数组跳过额外校验
      })
    } catch (error) {
      console.error("[Tuple Guard Error]", error)
      return false
    }
  }
}