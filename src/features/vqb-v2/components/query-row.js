import React from "react";
import styled from "styled-components";

const StyledQueryRow = styled.div`
  display: flex;
  flex-direction: row;
  /* background: white; */
  justify-content: space-evenly;
`;

export default function QueryRow({ children }) {
  return <StyledQueryRow>{children}</StyledQueryRow>;
}
