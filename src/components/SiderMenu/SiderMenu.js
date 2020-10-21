import React, { PureComponent, Suspense } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import { history } from 'umi';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import { getHomePath } from '@/utils/menu';

const MainMenu = React.lazy(() => import('./MainMenu'));
const SecondaryMenu = React.lazy(() => import('./SecondaryMenu'));

const { Sider } = Layout;

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    console.log('openKeys:', openKeys)

    const moreThanOne =
      openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  goToHomePage = () => {
    history.push(getHomePath());
  };

  render() {
    const {
      logo,
      fixSiderbar,
      theme,
      title,
    } = this.props;
    const { openKeys } = this.state;
    const defaultProps =   { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderbar]: fixSiderbar,
    });

    return (
      <Sider
        trigger={null}
        collapsible
        breakpoint="lg"
        width={275}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.menuLogo}>
          <div onClick={this.goToHomePage}>
            <img src={logo} alt="logo" />
            <h1>{title}</h1>
          </div>
       </div>

        <Suspense fallback={<PageLoading />}>
          <div className={styles.mainMenu}>
            <MainMenu
              handleOpenChange={this.handleOpenChange}
              style={{ padding: '20px 0', width: '100%' }}
              {...this.props}
              {...defaultProps}
            />
          </div>
          <div className={styles.secondaryMenu}>
            <SecondaryMenu
              {...this.props}
              mode="inline"
              handleOpenChange={this.handleOpenChange}
              onOpenChange={this.handleOpenChange}
              style={{ padding: '16px 0', width: '100%' }}
              {...defaultProps}
            />
           </div>
        </Suspense>
      </Sider>
    );
  }
}
