import React from "react";
import classNames from "classnames";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";

interface ButtonProps {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  as?: React.ElementType;
  intent?: "Hapus" | "Upload Nilai" | "Data Nilai";
  children?: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  as: Component = "button",
  intent = "primary",
  children,
}) => {
  const buttonClass = classNames("rounded ", {
    "mr-1 bg-red-500 hover:bg-red-700": intent === "Hapus",
    "mr-1 bg-green-500 hover:bg-green-700": intent === "Data Nilai",
  });

  const getLeftIcon = () => {
    switch (intent) {
      case "Hapus":
        return <DeleteIcon fontSize="small" style={{ fill: "#ffffff" }} />;
      case "Data Nilai":
        return <FolderIcon fontSize="small" style={{ fill: "#ffffff" }} />;
      default:
        return null;
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

export default ButtonComponent;
