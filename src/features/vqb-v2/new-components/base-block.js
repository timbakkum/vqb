import styled, { css } from "styled-components";
import { DisplayModes } from "./new-modifier-dropzone";

export const blockBorderColorMap = {
  node: "#B3D9FF",
  relationship: "#C964FF",
  modifier: "#00E3C9",
  empty: "grey",
};

export const blockColorMap = {
  node: "#EBF5FF",
  relationship: "#F8EBFF",
  modifier: "#94FFF3",
  empty: "lightgrey",
};

export const BlockTypes = {
  NODE: "node",
  REL: "relationship",
  MOD: "modifier",
};

const baseConnectorCss = css`
  content: "";
  position: absolute;
  display: block;
  border-width: 1px;
  border-style: solid;
`;

const baseVerticalConnectorCss = css`
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 6px;
`;

const baseHorizontalConnectorCss = css`
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 12px;
`;

const horizontalPrevConnectorCss = css`
  ${baseConnectorCss}
  ${baseHorizontalConnectorCss}
  left: -6px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  /* vary based on horizontal/vertical */
  border-right: 0;
`;

const horizontalNextConnectorCss = css`
  ${baseConnectorCss}
  ${baseHorizontalConnectorCss}
  right: -6px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  /* vary based on horizontal/vertical */
  border-left: 0;
`;

const verticalPrevConnectorCss = css`
  ${baseConnectorCss}
  ${baseVerticalConnectorCss}
  top: -6px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  /* vary based on horizontal/vertical */
  border-bottom: 0;
`;

const verticalNextConnectorCss = css`
  ${baseConnectorCss}
  ${baseVerticalConnectorCss}
  bottom: -6px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  /* vary based on horizontal/vertical */
  border-top: 0;
`;

export const BaseBlockWrapper = styled.div`
  display: flex;
  /* make dynamic based on list/collection direction */
  flex-direction: ${(props) =>
    props.orientation === DisplayModes.VERTICAL ? "column" : "row"};
  flex-wrap: nowrap;
  height: auto;
`;

export const BaseBlock = styled.div`
  display: block;
  position: relative;
  min-width: 125px;
  /* max-width: 250px; */
  min-height: 40px;
  padding: 10px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  background: ${(props) => blockColorMap[props.type]};
  border-color: ${(props) => blockBorderColorMap[props.type]};
  border-width: 1px;
  border-style: solid;
  border-radius: 6px;
  margin: 0px;
  opacity: ${(props) => (props.isBeingDragged ? 0 : 1)};

  &::before,
  &::after {
    /* vary based on type */
    background: ${(props) => blockColorMap[props.type]};
    border-color: ${(props) => blockBorderColorMap[props.type]};
  }

  /* previous connection */
  /* TODO make generic css generation function (horizontal/vertical, type, hasNext, hasPrevious) */
  &::before {
    ${(props) =>
      props.hasPrev
        ? props.orientation === DisplayModes.VERTICAL
          ? verticalPrevConnectorCss
          : horizontalPrevConnectorCss
        : ""};
  }

  /* next connection */
  &::after {
    ${(props) =>
      props.hasNext
        ? props.orientation === DisplayModes.VERTICAL
          ? verticalNextConnectorCss
          : horizontalNextConnectorCss
        : ""};
  }
`;

export const BaseBlockPlaceholder = styled(BaseBlock)`
  transition: opacity 0.3s ease;
  display: ${(props) => (props.shouldDisplay ? "block" : "none")};
  opacity: ${(props) => (props.shouldDisplay ? 1 : 0)};
`;
