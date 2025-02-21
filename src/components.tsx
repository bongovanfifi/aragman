import React, { useState } from "react";

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

const accordionStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  overflow: "hidden",
};

const headerStyle = {
  padding: "8px 16px",
  backgroundColor: "white",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "background-color 0.1s",
  "&:hover": {
    backgroundColor: "#f9fafb",
  },
};

const contentStyle = {
  padding: "8px 16px",
  backgroundColor: "white",
  borderTop: "1px solid #e5e7eb",
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

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const AccordionItem = ({ title, children, style }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ ...accordionStyle, ...style }}>
      <div onClick={() => setIsOpen(!isOpen)} style={headerStyle}>
        <span>{title}</span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : undefined }}>
          ▼
        </span>
      </div>
      {isOpen && <div style={contentStyle}>{children}</div>}
    </div>
  );
};

export { Chip, Input, Button, AccordionItem };
