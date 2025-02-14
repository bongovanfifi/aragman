import React from "react";

const baseStyle = {
  padding: "2px 8px", // px-2 py-0.5
  border: "1px solid #e5e7eb", // border
  borderRadius: "6px", // rounded-md
  transition: "transform 0.1s", // Add quick transition
};

const defaultStyle = {
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "#f9fafb", // hover:bg-gray-50
  },
};

const activeStyle = {
  backgroundColor: "#e5e7eb", // bg-gray-200
  "&:active": {
    backgroundColor: "#d1d5db", // Add even darker color when clicked
  },
};

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  style?: React.CSSProperties;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  style?: React.CSSProperties;
}

const Chip = ({ label, selected, onClick, style }: ChipProps) => (
  <div
    onClick={onClick}
    style={{
      ...baseStyle,
      ...(selected ? activeStyle : defaultStyle),
      display: "inline-flex",
      alignItems: "center",
      margin: "4px",
      ...style,
    }}
  >
    {label}
  </div>
);

const Input = ({ style, ...props }: InputProps) => (
  <input
    style={{
      ...baseStyle,
      ...defaultStyle,
      ...style,
    }}
    {...props}
  />
);

const Button = ({ text, style, ...props }: ButtonProps) => (
  <button
    style={{
      ...baseStyle,
      ...defaultStyle,
      ...style,
    }}
    {...props}
  >
    {text ? text : "Submit"}
  </button>
);

export { Chip, Input, Button };
