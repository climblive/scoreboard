import * as Chroma from "chroma-js";

export const getColorStyle = (color?: string, editable?: boolean) => {
  let borderColor = "transparent";
  let textColor = "inherit";
  if (color) {
    if (color.charAt(0) !== "#") {
      color = "#" + color;
    }
    const chromaInst = Chroma(color);
    const luminance = chromaInst.luminance();
    borderColor = chromaInst.darken(1).hex();
    textColor = luminance < 0.5 ? "#FFF" : "#333";
  }
  return {
    width: 100,
    border: "1px solid " + borderColor,
    borderRadius: "8px",
    background: color,
    color: textColor,
    padding: 5,
    margin: 0,
    textAlign: "center" as "center",
    cursor: editable ? "pointer" : "inherit",
  };
};
