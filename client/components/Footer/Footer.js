import './Footer.scss';
import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';

const version = process.env.version;
class Footer extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    footList: PropTypes.array
  };
  render() {
    return (
      <div className="footer-wrapper">
        <div className="fits">广东丰德科技有限公司</div>
      
      </div>
    );
  }
} 



Footer.defaultProps = {
  footList: [
    {
      title: 'GitHub',
      iconType: 'github',
      linkList: [
        {
          itemTitle: 'YApi 源码仓库',
          itemLink: 'https://github.com/YMFE/yapi'
        }
      ]
    },
    {
      title: '团队',
      iconType: 'team',
      linkList: [
        {
          itemTitle: 'YMFE',
          itemLink: 'https://ymfe.org'
        }
      ]
    },
    {
      title: '反馈',
      iconType: 'aliwangwang-o',
      linkList: [
        {
          itemTitle: 'Github Issues',
          itemLink: 'https://github.com/YMFE/yapi/issues'
        },
        {
          itemTitle: 'Github Pull Requests',
          itemLink: 'https://github.com/YMFE/yapi/pulls'
        }
      ]
    },
    {
      title: 'Copyright © 2018 YMFE',
      linkList: [
        {
          itemTitle: `版本: ${version} `,
          itemLink: 'https://github.com/YMFE/yapi/blob/master/CHANGELOG.md'
        },
        {
          itemTitle: '使用文档',
          itemLink: 'http://192.168.32.60:3006/zh/%E6%95%88%E7%8E%87%E5%B7%A5%E5%85%B7/yapi%E6%8E%A5%E5%8F%A3%E7%AE%A1%E7%90%86'
        }
      ]
    }
  ]
};

export default Footer;
