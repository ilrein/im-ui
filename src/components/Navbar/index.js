import React, { Component } from 'react'
import { Menu, Header } from 'semantic-ui-react'

export default class Navbar extends Component {
  render() {
    return (
      <Menu
        inverted
        style={{
          borderRadius: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
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
  }
}