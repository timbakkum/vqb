import React, { useState } from "react";
import styled from "styled-components";
import { BlockTypes } from "./base-block";
import { useDispatch } from "react-redux";
import { updateBlock } from "../store/vqb-v2.actions";

const predicateTypes = {
  PROPERTY: "property",
  BOOLEAN: "boolean",
};

const propertyKeys = [
  "tagline",
  "title",
  "released",
  "born",
  "name",
  "roles",
  "summary",
  "rating",
];

const stringOperators = ["EQUALS", "ENDS WITH", "CONTAINS", "REGEX"];

export const BaseBlockContents = styled.div``;

export const InputRow = styled.div`
  display: flex;
  margin-top: 5px;

  > * {
    margin-right: 5px;
  }

  input {
    width: 100px;
  }
`;

export default ({ id, label, type, predicateData }) => {
  console.log(id);
  const dispatch = useDispatch();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target, e.target.name, e.target.value);
    dispatch(
      updateBlock({
        blockId: id,
        field: name,
        newValue: value,
      })
    );
  };

  return (
    <>
      <span>{label}</span>
      {type === BlockTypes.MOD &&
        predicateData.type === predicateTypes.PROPERTY && (
          <InputRow>
            <select
              value={(predicateData && predicateData.propertyValue) || ""}
              onChange={handleFieldChange}
              name="propertyValue"
            >
              {propertyKeys.map((k, i) => (
                <option key={i} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <select
              value={(predicateData && predicateData.operatorValue) || ""}
              onChange={handleFieldChange}
              name="operatorValue"
            >
              {stringOperators.map((k, i) => (
                <option key={i} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <input
              type="text"
              onChange={handleFieldChange}
              value={(predicateData && predicateData.value) || ""}
              name="value"
            />
          </InputRow>
        )}
    </>
  );
};
