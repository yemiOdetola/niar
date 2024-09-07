import React from "react";
import { ChromePicker, CirclePicker } from "react-color";
import { colors } from "../types";
import { rbgaToString } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="w-full space-y-4">
      <ChromePicker
        className="border rounded-lg"
        color={value}
        onChange={(color) => {
          const fcolor = rbgaToString(color.rgb);
          onChange(fcolor);
        }}
      />
      <CirclePicker
        colors={colors}
        color={value}
        onChangeComplete={(color) => {
          const fcolor = rbgaToString(color.rgb);
          onChange(fcolor);
        }}
      />
    </div>
  );
}
