import React from "react";
import classNames from "classnames";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ButtonProps {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  as?: React.ElementType;
  intent?: "Hapus";
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  as: Component = "button",
  intent = "primary",
  children,
}) => {
  const buttonClass = classNames("rounded ", {
    "mr-1 bg-red-500 hover:bg-red-700": intent === "Hapus",
  });

  const getLeftIcon = () => {
    switch (intent) {
      case "Hapus":
        return <DeleteIcon fontSize="small" style={{ fill: "#ffffff" }} />;
    }
  };

  return (
    <Component type="submit" className={buttonClass}>
      {getLeftIcon() && (
        <Tooltip title={intent} placement="top">
          <IconButton aria-label={intent} size="small">
            {getLeftIcon()}
          </IconButton>
        </Tooltip>
      )}
      {children}
    </Component>
  );
};

export default Button;
