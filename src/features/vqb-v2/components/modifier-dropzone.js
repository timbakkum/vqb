import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import { createSelector } from "reselect";
import { useDrop } from "react-dnd";
import { BlockTypes } from "./block";
import { copyModifierBlock } from "./../store/vqb-v2.actions";

export default function ModifierDropzone({ modifierGroupId }) {
  const modifierGroupData = useSelector((state) =>
    modifierGroupId ? state.vqbv2.modifierGroups[modifierGroupId] : null
  );
  const hasItems = modifierGroupData && modifierGroupData.blocks.length > 0;
  const dispatch = useDispatch();
  const [{ isOver, canDrop, itemType }, drop] = useDrop({
    accept: BlockTypes.MOD,
    drop: (item, monitor) => {
      console.log("dropped item ", item, "on", monitor);
      const { type, isPrototype } = item;
      if (isPrototype) {
        console.log("firing");
        dispatch(
          copyModifierBlock({
            destination: { modifierGroupId, index: 0 },
            blockData: item,
          })
        );
      }
    },
    canDrop: (item, monitor) => {
      const { index: sourceIndex } = item;
      return true;
      // return items.length === 0;
    },
    collect: (monitor) => {
      // console.log(monitor);
      return {
        isOver: !!monitor.isOver(), // is something dragging over this zone?
        canDrop: !!monitor.canDrop(), // can the current item being dragged over be dropped here?
        itemType: monitor.getItemType(), // get the item type of the current item being dragged over
      };
    },
  });

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        minWidth: "200px",
        maxWidth: "200px",
        minHeight: "100px",
        background: "white",
        opacity: hasItems ? 1 : isOver && canDrop ? 1 : 0,
      }}
    >
      {modifierGroupData &&
        modifierGroupData.blocks.map((mod) => <p>modifier id {mod}</p>)}
    </div>
  );
}
