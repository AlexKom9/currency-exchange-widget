import React, { RefObject } from 'react'
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
  onFocus: (e?: React.FocusEvent<HTMLInputElement>) => void
  activeAccountCurrency: string
  isFocused: boolean
}

class SliderContainer extends React.PureComponent<
  ISlider,
  { currentSlideIndex: number }
> {
  private slider: SlickSlider | null
  private inputRef: RefObject<HTMLInputElement>

  constructor(props: ISlider) {
    super(props)
    this.slider = null
    this.inputRef = React.createRef()

    this.state = {
      currentSlideIndex: 0,
    }
  }

  componentDidMount() {
    const { currentSlideIndex } = this.state

    this.slider?.slickGoTo(currentSlideIndex)
    this.props.onChangeSlide(currentSlideIndex)

    if (this.props.mode === 'from') {
      this.props.onFocus()
      this.inputRef.current?.focus()
    }
  }

  render() {
    const { mode, onChangeSlide, onFocus, accounts } = this.props

    const slickSliderSettings = {
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      beforeChange: (_prevIndex: number, nextIndex: number) => {
        this.setState({ currentSlideIndex: nextIndex })
      },
      afterChange: (nextIndex: number) => {
        if (this.props.isFocused) {
          this.inputRef.current?.focus()
          onChangeSlide(nextIndex)
        }
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
            data-testid="ac-slick-slider"
          >
            {accounts.map((account, index) => {
              const isActive = this.state.currentSlideIndex === index

              return (
                <div
                  key={account.currency}
                  data-testid="ac-currency-exchange-widget-slider-slide"
                >
                  <Slide
                    inputRef={isActive ? this.inputRef : undefined}
                    account={account}
                    mode={mode}
                    isActive={isActive}
                    onFocus={onFocus}
                  />
                </div>
              )
            })}
          </SlickSlider>
        </div>
      </Container>
    )
  }
}

export const Slider = observer(SliderContainer)
