"use client";

import React, { FC } from "react";

interface CheckboxGroupProps {
  title: string;
  items: any[];
  selectedItems: any;
  setSelectedItems: (items: any) => void;
  CheckboxChange: (setState: any, selectedValues: any, value: any) => void;
  checkActive: (state: any, value: any) => boolean;
  t: (key: string) => string;
  classNamePrefix?: string;
  transformText?: (text: string) => string;
}

const CheckboxGroup: FC<CheckboxGroupProps> = ({
  title,
  items,
  selectedItems,
  setSelectedItems,
  CheckboxChange,
  checkActive,
  t,
  classNamePrefix = "",
  transformText = (text) => text.toLowerCase(),
}) => {
  return (
    <div className="cover-items">
      <label className="title-items">{t(title)}:</label>
      {items.map((itemObject) => {
        let itemName = Object.keys(itemObject)[0];
        let transformedItemName = transformText(itemName);

        return (
          <label
            key={itemName}
            className={`${classNamePrefix} ${transformedItemName}`}>
            <input
              type="checkbox"
              value={transformedItemName}
              checked={checkActive(selectedItems, transformedItemName)}
              onChange={() =>
                CheckboxChange(
                  setSelectedItems,
                  selectedItems,
                  transformedItemName
                )
              }
            />
            <span>{t(itemName)}</span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckboxGroup;
