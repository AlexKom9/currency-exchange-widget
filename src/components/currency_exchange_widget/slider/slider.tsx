import React from 'react'
import styled, { css } from 'styled-components'
import { observer } from 'mobx-react'

import SlickSlider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Slide } from './slide'
import { IAccountStore } from '../../../types/accounts_store'

const Container = styled.div<Pick<ISlider, 'mode'>>`
  height: 200px;
  width: 100%;
  padding-top: 32px;

  .swiper-container {
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 20px;
  }

  .swiper-pagination {
    bottom: 32px;
  }

  ${({ mode }) =>
    mode === 'from'
      ? css`
          position: relative;
          background: #3f94e4;

          &::after {
            display: block;
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 20px 20px 0 20px;
            border-color: #3f94e4 transparent transparent transparent;
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);
          }
        `
      : css`
          background: #3063ca;
        `}
`

interface ISlider {
  mode: 'from' | 'to'
  accounts: IAccountStore[]
  onChangeSlide: (currentIndex: number) => void
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
  activeAccountCurrency: string
  isActive: boolean
}

class SliderContainer extends React.PureComponent<ISlider> {
  private slider: SlickSlider | null

  constructor(props: ISlider) {
    super(props)
    this.slider = null
  }

  componentDidMount() {
    this.slider?.slickGoTo(0)
  }

  render() {
    const {
      mode,
      onChangeSlide,
      onFocus,
      accounts,
      activeAccountCurrency,
      isActive,
    } = this.props
    const slickSliderSettings = {
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      beforeChange: (_prevIndex: number, nextIndex: number) => {
        onChangeSlide(nextIndex)
      },
    }

    return (
      <Container
        data-testid={`ac-currency-exchange-widget-slider-${mode}`}
        mode={mode}
      >
        <div className="container height-full">
          <SlickSlider
            {...slickSliderSettings}
            ref={(elem) => {
              this.slider = elem
            }}
          >
            {accounts.map((account) => (
              <div
                key={account.currency}
                data-testid="ac-currency-exchange-widget-slider-slide"
              >
                <Slide
                  account={account}
                  mode={mode}
                  isActive={
                    isActive && account.currency === activeAccountCurrency
                  }
                  onFocus={onFocus}
                />
              </div>
            ))}
          </SlickSlider>
        </div>
      </Container>
    )
  }
}

export const Slider = observer(SliderContainer)
