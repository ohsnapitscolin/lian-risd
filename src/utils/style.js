import { css } from "styled-components";

export const breakpoints = {
  sm: 750,
  md: 960,
  lg: 1200,
};

export const responsive = {
  sm: (...args) => css`
    @media (min-width: 750px) {
      ${css(...args)};
    }
  `,
  md: (...args) => css`
    @media (min-width: 960px) {
      ${css(...args)};
    }
  `,
  lg: (...args) => css`
    @media (min-width: 1200px) {
      ${css(...args)};
    }
  `,
};
