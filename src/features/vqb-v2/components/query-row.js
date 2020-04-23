import React from "react";
import styled from "styled-components";

const StyledQueryRow = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border: 1px solid #979797;
  justify-content: center;
`;

export default function QueryRow({ children }) {
  return <StyledQueryRow>{children}</StyledQueryRow>;
}
