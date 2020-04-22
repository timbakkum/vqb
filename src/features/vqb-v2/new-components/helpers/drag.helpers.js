import { DragLocation, DisplayModes } from "./../constants/constants";

export const getHoverMiddle = (orientation, hoverBoundingRect) => {
  const getHorizontalHoverMiddle = () =>
    (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
  const getVerticalHoverMiddle = () =>
    (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  const hoverMiddle = {
    [DisplayModes.HORIZONTAL]: getHorizontalHoverMiddle,
    [DisplayModes.VERTICAL]: getVerticalHoverMiddle,
  };

  return hoverMiddle[orientation]();
};

export const getHoverDistanceInElement = (
  orientation,
  hoverBoundingRect,
  clientOffset
) => {
  const getHorizontalHoverClient = () =>
    clientOffset.x - hoverBoundingRect.left;
  const getVerticalHoverClient = () => clientOffset.y - hoverBoundingRect.top;

  const hoverClient = {
    [DisplayModes.HORIZONTAL]: getHorizontalHoverClient,
    [DisplayModes.VERTICAL]: getVerticalHoverClient,
  };

  return hoverClient[orientation]();
};

export const getDragLocationByOrientation = (monitor, ref, orientation) => {
  if (!monitor.isOver()) return null;
  const hoverBoundingRect = ref.current.getBoundingClientRect();
  const clientOffset = monitor.getClientOffset();

  const hoverMiddle = getHoverMiddle(orientation, hoverBoundingRect);
  const hoverDistance = getHoverDistanceInElement(
    orientation,
    hoverBoundingRect,
    clientOffset
  );

  if (hoverDistance < hoverMiddle) {
    return DragLocation.PREV;
  }
  if (hoverDistance >= hoverMiddle) {
    return DragLocation.NEXT;
  }
};

export const shouldMoveBlock = (
  monitor,
  ref,
  orientation,
  dragIndex,
  hoverIndex
) => {
  if (dragIndex === hoverIndex) {
    return false;
  }

  const hoverBoundingRect = ref.current.getBoundingClientRect();
  const clientOffset = monitor.getClientOffset();

  const hoverMiddle = getHoverMiddle(orientation, hoverBoundingRect);
  const hoverDistance = getHoverDistanceInElement(
    orientation,
    hoverBoundingRect,
    clientOffset
  );

  if (dragIndex < hoverIndex && hoverDistance < hoverMiddle) {
    return false;
  }

  if (dragIndex > hoverIndex && hoverDistance > hoverMiddle) {
    return false;
  }

  return true;
};
