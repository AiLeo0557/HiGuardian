import { isEmptyObject, isStrictObject } from "hi-datatype-operation";

type TypeGuardConfig<T extends object> = {
  [key in keyof T]: (value: unknown) => value is T[key];
};
/**
 * author: 杜朝辉
 * date: 2025-02-28
 * @param config 类型守卫配置对象（键为属性名，值为类型验证函数）
 * @returns 类型守卫函数
 */
export function createObjTypeGuard<T extends object>(
  config: TypeGuardConfig<T>
): (obj: unknown) => obj is T {
  return (obj: unknown): obj is T => {
    try {
      // 基础对象检查
      if (!isStrictObject(obj)) {
        throw new Error("Not a plain object");
      }
      if (isEmptyObject(obj)) {
        throw new Error("Empty object");
      }
      // 遍历配置中的每个键进行校验
      return (Object.keys(config) as Array<keyof T>).every((key) => {
        const validate = config[key];
        // return (
        //   key in obj &&           // 检查属性存在性
        //   validate((obj as T)[key])      // 使用配置的验证函数校验值
        // );
        // 直接访问属性并验证, 无需存在性检查
        return validate(obj[key as keyof typeof obj]); // 使用配置的验证函数校验值
      });
    } catch (error) {
      // 如果校验失败，返回false,并打印错误信息
      console.error(error);
      return false;
    }
  };
}