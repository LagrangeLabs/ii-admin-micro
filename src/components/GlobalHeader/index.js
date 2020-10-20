import React, { PureComponent } from 'react';
import styles from './index.less';
import RightContent from './RightContent';

export default class GlobalHeader extends PureComponent {
  render() {
    return (
      <div className={styles.header}>
        <RightContent {...this.props} />
      </div>
    );
  }
}
