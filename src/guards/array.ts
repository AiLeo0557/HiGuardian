type ArrayTypeGuardConfig<T> = (value: unknown) => value is T;

/**
 * 创建数组类型守卫函数
 * @param elementGuard 数组元素类型验证函数
 * @returns 类型守卫函数，判断是否为指定类型的数组
 */
export function createArrayTypeGuard<T>(
  elementGuard: ArrayTypeGuardConfig<T>
): (arr: unknown) => arr is T[] {
  return (arr: unknown): arr is T[] => {
    try {
      // 基础数组类型检查
      if (!Array.isArray(arr)) {
        throw new Error("Not an array");
      }

      // 空数组检查（根据需求可选）
      if (arr.length === 0) {
        throw new Error("Empty array");
      }

      // 校验每个元素的类型
      return arr.every((item) => elementGuard(item));
    } catch (error) {
      console.error(error);
      return false;
    }
  };
}