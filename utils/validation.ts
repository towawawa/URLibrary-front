import { get } from 'lodash-es';
import { dayjs } from '@/plugins/dayjs';

type StrOption =
  | 'date'
  | 'distinct'
  | 'email'
  | 'regex:alphaNum'
  | 'regex:alphaNumSymbol'
  | 'regex:cidr'
  | 'required'
  | `max:${number}`
  | `min:${number}`
  | `requiredIf:${string},${string}`
  | `same:${string}`;

type NumOption =
  | 'required'
  | `decimal:${number}`
  | `digits:${number}`
  | `max:${number}`
  | `min:${number}`
  | `requiredIf:${string},${string}`;

type ArrayOption = 'required' | `max:${number}`;

type FileOption =
  | 'required'
  | `max:${number}MB`
  | `requiredIf:${string},${string}`
  | `requiredIf:${string}`;

export type Option = ArrayOption | FileOption | NumOption | StrOption;

export type Errors = [string, ...string[]];

export function validate<
  Data extends Record<string, unknown> | Record<string, unknown>[],
  ValidateOption extends Option[],
>(
  data: Data,
  propName: string,
  names: Record<string, any>,
  options: ValidateOption,
): Errors | void {
  let errors: Errors | void = void 0;
  const value = get(data, propName);

  // 必須項目のバリデーション
  if (options) {
    const requiredErrors = validateRequired(data, propName, names, options);

    errors =
      requiredErrors.length === 0 ? undefined : (requiredErrors as Errors);
  }

  // 文字列の場合
  if (typeof value === 'string') {
    errors = strValidation(data, propName, names, options as StrOption[]);
  }
  // 数値の場合
  else if (typeof value === 'number') {
    errors = numValidation(data, propName, names, options as NumOption[]);
  }
  // 配列の場合
  else if (Array.isArray(value)) {
    errors = arrayValidation(data, propName, names, options as ArrayOption[]);
  }
  // ファイルの場合
  else if (value instanceof File) {
    errors = fileValidation(data, propName, names, options as FileOption[]);
  }

  return errors;
}

/**
 * 文字列バリデーション
 *
 * @param data
 * @param name
 * @param propName
 * @param options
 * @returns
 */
function strValidation<
  Data extends Record<string, unknown> | Record<string, unknown>[],
>(
  data: Data,
  propName: string,
  names: Record<string, any>,
  options: StrOption[],
): Errors | void {
  const value = get(data, propName);
  const name = getName(names, propName);
  const errors = validateRequired(data, propName, names, options);

  // 必須項目以外は、空文字の場合はバリデーションしない
  if (!value) {
    if (errors.length === 0) {
      return;
    } else {
      return errors as Errors;
    }
  }

  // 日付
  if (options.includes('date')) {
    const isDate = dayjs(value, ['YYYY-MM-DD', 'YYYY/MM/DD'], true).isValid();

    if (!isDate) {
      errors.push(`${name}は日付形式で指定してください。`);
    }
  }

  // メールアドレス
  if (options.includes('email')) {
    const emailRegex = /^[\dA-Za-z][\w.-]*@[\w.-]+\.[\dA-Za-z]+$/;

    if (!emailRegex.test(value)) {
      errors.push(`メールアドレス形式で指定してください。`);
    }
  }

  // 半角英数字
  if (options.includes('regex:alphaNum')) {
    const alphanumericRegex = /^[\dA-Za-z]*$/;

    if (!alphanumericRegex.test(value)) {
      errors.push(`${name}は半角英数字で指定してください。`);
    }
  }

  // 半角英数字記号
  if (options.includes('regex:alphaNumSymbol')) {
    const alphanumericSymbolRegex = /^([!-~])+$/;

    if (!alphanumericSymbolRegex.test(value)) {
      errors.push(`${name}は半角英数字記号で指定してください。`);
    }
  }

  // CIDR
  if (options.includes('regex:cidr')) {
    const cidrRegex =
      /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\/(?:\d|[12]\d|3[0-2])$/;

    if (!cidrRegex.test(value)) {
      errors.push(`${name}はIPアドレス形式で指定してください。`);
    }
  }

  // x文字以上か
  const minOption = options.find((element) => element.startsWith('min'));

  if (minOption) {
    const minNum = Number(minOption.split(':')[1]);

    if (value.length < minNum) {
      errors.push(`${name}は${minNum}文字以上で指定してください。`);
    }
  }

  // x文字以下か
  const maxOption = options.find((element) => element.startsWith('max'));

  if (maxOption) {
    const maxNum = Number(maxOption.split(':')[1]);

    if (value.length > maxNum) {
      errors.push(`${name}は${maxNum}文字以下で指定してください。`);
    }
  }

  // 指定した文字列と同じか
  const sameOption = options.find((element) => element.startsWith('same'));

  if (sameOption) {
    const samePropName = sameOption.split(':')[1];
    const sameValue = get(data, samePropName);

    if (value !== sameValue) {
      errors.push(`${name}が${get(names, samePropName)}と一致していません。`);
    }
  }

  // 重複
  if (options.includes('distinct')) {
    // propNameの文字列最後にある[x]となっている箇所を[0] ~ [n]に置換して、チェック
    const propPath = propName.replace(/\[\d+]\.\w+$/, '');
    const propKey = propName.split('.').pop();

    const values: string[] = [];

    let arrayValue = '';

    for (let i = 0; arrayValue !== undefined; i++) {
      const arrayProp = `${propPath}[${i}].${propKey}`;

      // propNameと同じプロパティはチェックしない
      if (arrayProp === propName) {
        continue;
      }

      arrayValue = get(data, arrayProp) as string;

      values.push(arrayValue);
    }

    const notError = values.every((element) => value !== element);

    if (!notError) {
      errors.push(`${name}が重複しています。`);
    }
  }

  if (errors.length === 0) {
    return;
  }

  return errors as Errors;
}

/**
 * 数値バリデーション
 *
 * @param value
 * @param name
 * @param options
 * @returns
 */
function numValidation<
  Data extends Record<string, unknown> | Record<string, unknown>[],
>(
  data: Data,
  propName: string,
  names: Record<string, string>,
  options: NumOption[],
): Errors | void {
  const value = get(data, propName);
  const name = getName(names, propName);
  const errors = validateRequired(data, propName, names, options);

  if (!value && value !== 0) {
    if (errors.length === 0) {
      return;
    } else {
      return errors as Errors;
    }
  }

  const decimalOption = options.find((element) =>
    element.startsWith('decimal'),
  );

  // 小数点以下に指定できる桁数
  if (decimalOption) {
    const decimal = Number(decimalOption.split(':')[1]);
    const valueStr = String(value);
    const decimalNumber = valueStr.split('.')[1];

    if (decimalNumber && decimalNumber.length > decimal) {
      errors.push(`${name}は小数点第${decimal}位まで入力可能です。`);
    }
  }

  // x以上か
  const minOption = options.find((element) => element.startsWith('min'));

  if (minOption) {
    const minNum = Number(minOption.split(':')[1]);

    if (value < minNum) {
      errors.push(`${name}は${minNum}以上で指定してください。`);
    }
  }

  // x以下か
  const maxOption = options.find((element) => element.startsWith('max'));

  if (maxOption) {
    const maxNum = Number(maxOption.split(':')[1]);

    if (value > maxNum) {
      errors.push(`${name}は${maxNum}以下で指定してください。`);
    }
  }

  // 桁数
  const digitsOption = options.find((element) => element.startsWith('digits'));

  if (digitsOption) {
    const digits = Number(digitsOption.split(':')[1]);

    if (String(value).length !== digits) {
      errors.push(`${name}は${digits}桁で指定してください。`);
    }
  }

  if (errors.length === 0) {
    return;
  }

  return errors as Errors;
}

/**
 * 配列バリデーション
 *
 * @param value
 * @param name
 * @param options
 * @returns
 */
function arrayValidation<
  Data extends Record<string, unknown> | Record<string, unknown>[],
>(
  data: Data,
  propName: string,
  names: Record<string, string>,
  options: ArrayOption[],
): Errors | void {
  const value = get(data, propName);
  const name = getName(names, propName);
  const errors = validateRequired(data, propName, names, options);

  if (value.length === 0) {
    if (errors.length === 0) {
      return;
    } else {
      return errors as Errors;
    }
  }

  // 最大要素数
  const maxOption = options.find((element) => element.startsWith('max'));

  if (maxOption) {
    const maxNum = Number(maxOption.split(':')[1]);

    if (value.length > maxNum) {
      errors.push(`${name}は、${maxNum}件以下で指定してください。`);
    }
  }

  if (errors.length === 0) {
    return;
  }

  return errors as Errors;
}

function fileValidation<
  Data extends Record<string, unknown> | Record<string, unknown>[],
>(
  data: Data,
  propName: string,
  names: Record<string, string>,
  options: FileOption[],
): Errors | void {
  const value = get(data, propName) as File;
  const errors = validateRequired(data, propName, names, options);

  if (!value) {
    if (errors.length === 0) {
      return;
    } else {
      return errors as Errors;
    }
  }

  // ファイルサイズから数値のみを取得
  const maxOption = options.find((element) => element.startsWith('max'));

  if (maxOption) {
    const maxNum = Number(maxOption.split(':')[1].replace('MB', ''));

    if (value.size > maxNum * 1024 * 1024) {
      errors.push(`${maxNum}MB以下で指定してください。`);
    }
  }

  if (errors.length === 0) {
    return;
  }

  return errors as Errors;
}

function validateRequired<
  Data extends Record<string, unknown> | Record<string, unknown>[],
>(
  data: Data,
  propName: string,
  names: Record<string, string>,
  options: Option[],
): string[] {
  const value = get(data, propName);
  const name = getName(names, propName);
  const errors: string[] = [];

  let isRequired = options.includes('required');
  let message = `${name}は必ず指定してください。`;

  // 条件付きの必須
  let requiredIfOptions = options.filter(
    (element) => element.startsWith('requiredIf') && !element.includes(','),
  );

  for (const requiredIfOption of requiredIfOptions) {
    // 'requiredIf:sample' → 'sample'に変換
    const conditionProp = requiredIfOption.split(':')[1];
    const comparisonValue = get(data, conditionProp);

    // 値がある場合は必須
    if (comparisonValue !== null) {
      isRequired = true;
      const jointedName = requiredIfOptions
        .map((option) => getName(names, option.split(':')[1]))
        .join(',');
      message = `${jointedName}を指定する場合、${name}は必ず指定してください。`;
    }
  }

  // 条件付きの必須 値あり
  requiredIfOptions = options.filter(
    (element) => element.startsWith('requiredIf') && element.includes(','),
  );

  for (const requiredIfOption of requiredIfOptions) {
    // 'requiredIf:sample,true' → 'sample,true'に変換
    const comparisonTarget = requiredIfOption.split(':')[1];
    // sample,true → ['sample', 'true']
    const [conditionProp, conditionIfValue] = comparisonTarget.split(',');

    const comparisonValue = get(data, conditionProp);

    if (
      (typeof comparisonValue === 'boolean' &&
        String(comparisonValue) === conditionIfValue) ||
      (typeof comparisonValue === 'number' &&
        String(comparisonValue) === conditionIfValue) ||
      comparisonValue === conditionIfValue
    ) {
      isRequired = true;
      message = `${getName(
        names,
        conditionProp,
      )}が有効の場合、${name}は必ず指定してください。`;
    }
  }

  if (!isRequired) return errors;

  // 型ごとに必須のバリデーションが違うので、その型ごとに分岐
  if (Array.isArray(value)) {
    if (value.length === 0) {
      errors.push(message);
    }
  } else if (typeof value === 'number') {
    if (!value && value !== 0) {
      errors.push(message);
    }
    // 文字列、ファイル
  } else {
    if (!value) {
      errors.push(message);
    }
  }

  return errors;
}

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
 * namesから指定されたプロパティの名前を取得する
 * @param names
 * @param propName
 * @returns
 */
function getName(names: Record<string, any>, propName: string): string {
  const convertedPropName = convertPropName(propName);

  for (const nameProp in names) {
    const pattern = new RegExp(`^${nameProp.replaceAll(/\*/g, '\\d+')}$`);

    if (pattern.test(convertedPropName)) {
      return names[nameProp];
    }
  }

  return '';
}
