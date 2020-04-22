import React, { useState } from "react";
import styled from "styled-components";
import { BlockTypes } from "./base-block";

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

const stringOperators = ["equals", "ends with", "contains", "regex"];

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

export default ({ label, type, predicateData }) => {
  console.log(type);
  const [propertyValue, setPropertyValue] = useState(
    (predicateData && predicateData.propertyValue) || ""
  );
  const [operator, setOperatorValue] = useState(
    (predicateData && predicateData.operatorValue) || ""
  );

  const [value, setValue] = useState(
    (predicateData && predicateData.value) || ""
  );

  const handlePropertyChange = (e) => {
    setPropertyValue(e.target.value);
  };

  const handleOperatorChange = (e) => {
    setOperatorValue(e.target.value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <span>{label}</span>
      {type === BlockTypes.MOD &&
        predicateData.type === predicateTypes.PROPERTY && (
          <InputRow>
            <select value={propertyValue} onChange={handlePropertyChange}>
              {propertyKeys.map((k, i) => (
                <option key={i} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <select value={operator} onChange={handleOperatorChange}>
              {stringOperators.map((k, i) => (
                <option key={i} value={k}>
                  {k}
                </option>
              ))}
            </select>

            <input type="text" onChange={handleValueChange} value={value} />
          </InputRow>
        )}
    </>
  );
};
