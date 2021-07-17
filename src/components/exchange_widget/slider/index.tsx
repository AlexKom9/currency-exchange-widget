import React from 'react'
import styled, { css } from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Keyboard, Pagination } from 'swiper/core'

import 'swiper/swiper.scss'
import 'swiper/components/pagination/pagination.min.css'
import { Slide } from './slide'

SwiperCore.use([Keyboard, Pagination])

const Container = styled.div<Pick<ISlider, 'position'>>`
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
  ${({ position }) =>
    position === 'top'
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
  position: 'top' | 'bottom'
}

export const Slider = (props: ISlider) => {
  return (
    <Container position={props.position}>
      <div className="container height-full">
        <Swiper
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
        >
          <SwiperSlide>
            <Slide />
          </SwiperSlide>
          <SwiperSlide>
            <Slide />
          </SwiperSlide>
          <SwiperSlide>
            <Slide />
          </SwiperSlide>
        </Swiper>
      </div>
    </Container>
  )
}
