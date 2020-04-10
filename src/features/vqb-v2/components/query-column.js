import React from "react";
import styled from "styled-components";

const StyledQueryColumn = styled.div`
  width: 25%;
  padding: 20px;
  border: 1px solid black;
`;

export default function QueryColumn({ children }) {
  return <StyledQueryColumn>{children}</StyledQueryColumn>;
}
