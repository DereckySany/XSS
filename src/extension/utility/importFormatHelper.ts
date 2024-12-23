import { v1 as uuidv1 } from 'uuid';
import { IScriptItem } from '../../types';

export default function importFormatHelper(
  data: Array<IScriptItem | Omit<IScriptItem, 'id'>>,
): Array<IScriptItem> {
  if (!Array.isArray(data)) return [];
  let savelist = [...data];
  savelist = savelist.filter(
    item =>
      Object.prototype.hasOwnProperty.call(item, 'title') &&
      Object.prototype.hasOwnProperty.call(item, 'code'),
  );
  savelist = savelist.map(
    item =>
      ({
        ...item,
        autoExecute: !!item.autoExecute,
        title: item.title,
        code: item.code,
      }) as IScriptItem,
  );
  return savelist.map(item => ({
    ...item,
    id: 'id' in item ? item.id : uuidv1(),
  }));
}
