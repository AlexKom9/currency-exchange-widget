import React from 'react'
import styled from 'styled-components'
import { Button } from '../ui/button'
import { Slider } from './slider'

const RootContainer = styled.div`
  background: #3f94e4;
  max-width: 414px;
  min-height: 716px;
  height: 100vh;
  padding-top: 24px;

  .container {
    padding: 0 8px;
  }

  .height-full {
    height: 100%;
  }

  .mts {
    margin-top: 8px;
  }

  .mtm {
    margin-top: 16px;
  }
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`

export const ExchangeWidgetRoot = () => {
  return (
    <RootContainer>
      <div className="container">
        <Header>
          <Button>Cancel</Button>
          <Button>Exchange</Button>
        </Header>
      </div>
      <div>
        <Slider position="top" />
        <Slider position="bottom"/>
      </div>
    </RootContainer>
  )
}
