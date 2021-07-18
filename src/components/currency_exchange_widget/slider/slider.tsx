import React from 'react'
import styled, { css } from 'styled-components'
import { observer } from 'mobx-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Keyboard, Pagination } from 'swiper/core'

import 'swiper/swiper.scss'
import 'swiper/components/pagination/pagination.min.css'
import { Slide } from './slide'
import { IAccountStore } from '../../../types/accounts_store'

SwiperCore.use([Keyboard, Pagination])

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
}

export const Slider = observer(({ mode, accounts }: ISlider) => {
  return (
    <Container mode={mode}>
      <div className="container height-full">
        <Swiper
          slidesPerView={1}
          pagination={{
            clickable: true,
          }}
          observer={true}
        >
          {accounts.map((account) => (
            <SwiperSlide key={account.currency}>
              {({ isActive }) => {
                return (
                  <Slide account={account} mode={mode} isActive={isActive} />
                )
              }}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  )
})
