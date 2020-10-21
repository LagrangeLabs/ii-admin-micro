import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu } from 'antd';
import { Link } from 'umi';
import { getSelectedMenuKeys, conversionPath } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import MyIcon from '@/components/MyIcon';
import styles from './index.less';

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && isUrl(icon)) {
    return <img src={icon} alt="icon" />;
  }

  if (typeof icon === 'string') {
    return <MyIcon type={`${icon}`} />;
  }

  return icon;
};

export default class MainMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }

    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getMenuItem(item, parent))
      .filter(item => item);
  };

  /**
   * get MenuItem
   */
  getMenuItem = item => {
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;

    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location } = this.props;

    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        className={styles.menuItem}
      >
        {icon}
      </Link>
    );
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      flatMenuKeys,
    } = this.props;

    // if pathname can't match, use the nearest parent's key
    let selectedKeys = getSelectedMenuKeys(pathname, flatMenuKeys);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }

    const { handleOpenChange, style, menuData } = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={cls}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
