import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';

/**
 * Recursively flatten the data
 * [{path:string},{path2:string}] => [path, path2]
 *
 * @param  menus
 */
export const getFlatMenuKeys = menuData => {
  let keys = [];

  menuData.forEach(item => {
    keys.push(item.path);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });

  return keys;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
export const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;

  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

// Get the currently selected menu
export const getSelectedMenuKeys = (pathname, flatMenuKeys) => {
  return urlToList(pathname).map(itemPath =>
    getMenuMatches(flatMenuKeys, itemPath).pop(),
  );
};

export const conversionPath = path => {
  if (path && path.indexOf('http') === 0) {
    return path;
  }

  return `/${path || ''}`.replace(/\/+/g, '/');
};
