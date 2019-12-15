import React from 'react';
import {
  Menu,
  Header,
  Icon,
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const Navbar = ({ history, hasBack }) => (
  <Menu
    inverted
    style={{
      borderRadius: 0,
    }}
  >
    {
      hasBack
        ? (
          <Menu.Item
            name="brand"
            as="a"
            style={{ border: 'none' }}
            onClick={() => history.goBack()}
          >
            <Icon
              name="chevron left"
            />
          </Menu.Item>      
        )
        : null
    }
    <Menu.Item
      name="brand"
      style={{ border: 'none' }}
    >
      <Header
        style={{ color: 'white' }}
      >
        IM
      </Header>
    </Menu.Item>
  </Menu>
)

export default withRouter(Navbar);
