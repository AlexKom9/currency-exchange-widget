import React from 'react'
import styled from 'styled-components'
import { Button } from '../ui/button'
import { Description, H2 } from '../ui/typography'

const RootContainer = styled.div`
    background: #3f94e4;
    max-width: 414px;
    padding: 8px;
    min-height: 716px;
    height: 100vh;
`

const Header = styled.header`
    display: flex;
    justify-content: space-between;
`
const Sliders = styled.header`
    margin-top: 24px;
`

const Slider = styled.div`
    height: 300px;
`

const Slide = styled.div`
    box-sizing: border-box;
    width: 100%;
    padding: 8px 24px;
`

const SlideInner = styled.div`
    display: flex;
    justify-content: space-between;
`

export const ExchangeWidgetRoot = () => {
    return (
        <RootContainer>
            <Header>
                <Button>Cancel</Button>
                <Button>Exchange</Button>
            </Header>
            <Sliders>
                <Slider>
                    <Slide>
                        <SlideInner>
                            <div>
                                <H2>GBP</H2>
                                <Description>You have $58.33</Description>
                            </div>
                            <div>
                                <H2>GBP</H2>
                                <Description>You have $58.33</Description>
                            </div>
                        </SlideInner>
                    </Slide>
                    <Slide>
                        <SlideInner>
                            <div>
                                <H2>GBP</H2>
                                <Description>You have $58.33</Description>
                            </div>
                            <div>
                                <H2>GBP</H2>
                                <Description>You have $58.33</Description>
                            </div>
                        </SlideInner>
                    </Slide>
                    <Slide>
                        <SlideInner>
                            <div>
                                <H2>GBP</H2>
                                <Description>You have $58.33</Description>
                            </div>
                            <div>
                                <H2>GBP</H2>
                                <Description>You have $58.33</Description>
                            </div>
                        </SlideInner>
                    </Slide>
                </Slider>
                <Slider>Slider 2</Slider>
            </Sliders>
        </RootContainer>
    )
}
