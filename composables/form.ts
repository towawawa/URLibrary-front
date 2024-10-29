import { cloneDeep, get, isNaN, set, unset } from 'lodash-es';
import type { Errors, Option } from '@/utils/validation';
import type { GetFieldType } from 'lodash';
import { validate } from '@/utils/validation';

/**
 *  propNameをvalidations, namesの指定方式へ変換する
 * @param propName -[0].a.[0].b
 * @returns convertedPropName  -0.a.0.b
 */
function convertPropName(propName: string) {
  const convertedPropName = propName.replaceAll(
    /\[(\d+)]/g,
    function (match, p1) {
      return `.${p1}`;
    },
  );

  if (convertedPropName.startsWith('.')) {
    convertedPropName.slice(1);
  }

  return convertedPropName;
}

/**
 * convertQueryParam
 * @param propName
 * @returns
 */
function convertQueryProp(propName: string) {
  const convertedPropName = propName.replaceAll(
    /\[(.*?)]/g,
    function (match, p1) {
      if (match === '[]') {
        return '';
      }

      return `.${p1}`;
    },
  );

  if (convertedPropName.startsWith('.')) {
    convertedPropName.slice(1);
  }

  return convertedPropName;
}

/**
 * フォームを管理
 * @param initialData - 初期データ
 * @param initialValidations - バリデーション
 * @param initialNames - 表示名
 * @returns
 */
export function useForm<
  Data extends Record<string, unknown> | Record<string, unknown>[],
>(
  initialData: Data,
  initialValidations: Record<string, Option[]> = {},
  initialNames: Record<string, string> = {},
) {
  const data = ref(cloneDeep(initialData));
  const errors = ref<Record<string, Errors>>({});
  const validations = initialValidations;
  const names = initialNames;

  /**
   * バリデーションを取得する（ワイルドカードが使用されている箇所は、それもマージして取得する）
   * @param propName - ネストしている場合、ドット区切りで指定。配列は[x]
   * @returns
   */
  function getValidation(propName: string): Option[] {
    const convertedPropName = convertPropName(propName);
    let mergedValidation: Option[] = [];

    for (const validationKey in validations) {
      const pattern = new RegExp(
        `^${validationKey.replaceAll(/\*/g, '\\d+')}$`,
      );

      if (pattern.test(convertedPropName)) {
        mergedValidation = [
          ...new Set([...mergedValidation, ...validations[validationKey]]),
        ];
      }
    }

    return mergedValidation;
  }

  type UpdateOptions = {
    validate?: boolean;
  };
  const defaultOptions: UpdateOptions = {
    validate: true,
  };

  /**
   * dataとerrorsの更新
   * @param propName - ネストしている場合、ドット区切りで指定。配列は[x]
   * @param value - 更新する値
   */
  function update<T extends string>(
    propName: T,
    value: GetFieldType<Data, T>,
    options: UpdateOptions = defaultOptions,
  ) {
    // 指定されたプロパティへvalueを代入
    set(data.value, propName, value);

    if (!options.validate) {
      return;
    }

    const validation = getValidation(propName);
    const errorsValue = validate(data.value, propName, names, validation);

    const convertedPropName = convertPropName(propName);

    if (errorsValue) {
      errors.value[convertedPropName] = errorsValue;
    } else if (errors.value[convertedPropName]) {
      delete errors.value[convertedPropName];
    }

    // 更新された値が配列だった場合、配列の要素もバリデーションする
    if (Array.isArray(value)) {
      let index = 0;

      // 既存エラーのリセット
      for (const key in errors.value) {
        if (key.includes(propName) && key !== propName) {
          unset(errors.value, key);
        }
      }

      for (const item of value) {
        const itemPropName = `${propName}.${index}`;

        // オブジェクトの場合、すべてのプロパティをバリデーションする
        if (typeof item === 'object' && item !== null) {
          for (const key in item) {
            update(`${itemPropName}.${key}`, item[key]);
          }
        } else {
          update(itemPropName, item);
        }

        index++;
      }
    }
  }

  /**
   * 現在のクエリパラメータをdataへセットする
   */
  const setQueryParam = (): void => {
    // 初期値でdataをリセット
    Object.assign(data.value, initialData);

    // route.queryの値を、data.valueに設定
    const queryParams = useRoute().query;

    for (const key in queryParams) {
      // オブジェクト配列の場合、処理しない @todo 処理するように修正
      if (/\[\d+].*\[.*]/.test(key)) continue;

      const propName = convertQueryProp(key);
      let queryParam = queryParams[key] as any; // @todo 正しい型定義
      const dataParam = get(data.value, propName);

      // 配列が1件の場合、配列で取得できないので、配列に変換
      if (
        key.includes('[]') &&
        (typeof queryParam === 'string' || typeof queryParam === 'number')
      ) {
        queryParam = [queryParam];
      }

      // 数値の場合、文字列から数値に変換
      if (
        typeof queryParam === 'string' &&
        queryParam !== '' &&
        !isNaN(Number(queryParam))
      ) {
        queryParam = Number(queryParam);
      }

      // booleanも文字列から変換
      if (!isNaN(queryParam) && typeof dataParam === 'boolean') {
        queryParam = Boolean(Number(queryParam));
      }

      // 数値の配列も変換する
      if (
        Array.isArray(dataParam) &&
        Array.isArray(queryParam) &&
        dataParam.every((item) => typeof item === 'number') &&
        queryParam.every((item) => !isNaN(Number(item)))
      ) {
        queryParam = queryParam.map(Number);
      }

      // dataに存在しない or dataの型と一致しない場合除外
      if (
        dataParam !== null &&
        (dataParam === undefined ||
          (typeof dataParam !== typeof queryParam &&
            typeof dataParam !== 'string'))
      ) {
        continue;
      }

      update(propName, queryParam);
    }
  };

  /**
   * 現在のクエリパラメータをdataへセットする
   * form.setQueryParam() を動的検索用に拡張
   */
  function setQueryParamForDynamicSearch() {
    // 現在のクエリパラメータをdataへセットする
    setQueryParam();

    // 現在のクエリ
    const queryParams = useRoute().query;

    // クエリに含まれる検索条件をformに格納
    const conditions = Object.entries(queryParams)
      .map(([key, value]) => {
        if (Array.isArray(value) || !key.includes('[item]')) {
          return null;
        }

        // index番号を取得
        const index = key.match(/conditions\[(?<index>\d+)]\[item]/)?.groups
          ?.index;

        // [item]、[value]共に存在している事を確認
        if (!index || !(`conditions[${index}][value]` in queryParams)) {
          return null;
        }

        return {
          item: value as string,
          value: queryParams[`conditions[${index}][value]`] as string,
        };
      })
      .filter((condition) => condition !== null);

    // formを更新する
    if (conditions.length > 0) {
      // @ts-ignore 「conditions」という固定値に限定
      update('conditions', conditions);
    }
  }

  /**
   * errorsの中に、1つでもエラーがあればfalse、なければtrueを返す
   */
  const isErrors = (): boolean => {
    for (const key in errors.value) {
      // エラーが一つでもあればtrue
      if (Array.isArray(errors.value[key]) && errors.value[key].length > 0) {
        return true;
      }
    }

    return false;
  };

  /**
   * すべての値をバリデーションし、errorsへセットする。
   * エラーがあればtrueを返す
   *
   * @returns boolean
   */
  const allValidate = (): boolean => {
    for (const key in data.value) {
      update(key, data.value[key] as any); // @todo 正しい型定義
    }

    return isErrors();
  };

  /**
   * エラーメッセージの最初のメッセージを取得
   * @param errorPath エラーメッセージのプロパティ名
   * @returns
   */
  const firstError = (errorPath: string): string | undefined => {
    const convertedPropName = convertPropName(errorPath);
    const error = errors.value[convertedPropName];

    if (Array.isArray(error) && error.length > 0) {
      return error[0];
    }

    return undefined;
  };

  /**
   * エラーメッセージをセット（存在しないプロパティのエラーはセットしない）
   * @param targetErrors
   */
  const setErrors = (targetErrors: Record<string, Errors>): void => {
    // 既存エラーのリセット
    for (const key in errors.value) {
      unset(errors.value, key);
    }

    for (const key in targetErrors) {
      const value = get(data.value, key);

      if (value !== undefined) {
        errors.value = {
          ...errors.value,
          [key]: targetErrors[key],
        };
      }
    }
  };

  /**
   * dataに値をまとめてセットする
   * @param values
   */
  const setValues = <T>(values: T): void => {
    for (const key in values) {
      // dataに存在しないプロパティは無視
      if (get(data.value, key) === undefined) {
        continue;
      }

      update(key, values[key] as any); // @todo 正しい型定義
    }
  };

  /**
   * 指定されたプロパティのエラーメッセージを削除
   * @param propName
   */
  const clearError = (propName: string): void => {
    const convertedPropName = convertPropName(propName);

    if (errors.value[convertedPropName]) {
      delete errors.value[convertedPropName];
    }
  };

  return {
    data: readonly(data.value) as Data,
    errors, // バリーションエラーメッセージ
    update, // プロパティの更新
    firstError, // 最初のエラーメッセージを取得
    isErrors, // エラーがあるかどうか
    setErrors, // エラーメッセージをセット
    setQueryParam, // クエリパラメータをdataへセット
    setQueryParamForDynamicSearch, // 動的検索用。クエリパラメータをdataへセット
    allValidate, // すべての値をバリデーションする
    setValues, // dataに値をまとめてセットする
    clearError, // 指定されたプロパティのエラーメッセージを削除
    validations, // バリデーション
    names, // 表示名
  };
}
