type UnionTypeGuardConfig<T> = Array<(value: unknown) => value is T>;

/**
 * 创建联合类型守卫函数
 * @param config - 联合类型验证配置数组（每个函数对应一种可能的类型）
 * @returns 类型守卫函数
 */
export function createUnionTypeGuard<T>(
  config: UnionTypeGuardConfig<T>
): (value: unknown) => value is T {
  // 预校验配置合法性
  if (!Array.isArray(config) || config.length === 0) {
    throw new Error("Union type guard requires at least one validator");
  }

  return (value: unknown): value is T => {
    try {
      // 遍历所有验证器进行校验
      return config.some(validator => {
        const result = validator(value);
        if (typeof result !== 'boolean') {
          throw new Error(`Validator must return boolean, got ${typeof result}`);
        }
        return result;
      });
    } catch (error) {
      console.error("[Union Type Guard Error]", error);
      return false;
    }
  };
}