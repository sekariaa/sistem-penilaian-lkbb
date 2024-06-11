import React from "react";
import classNames from "classnames";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";

interface ButtonProps {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  as?: React.ElementType;
  intent?: "Hapus" | "Upload Nilai";
  children?: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  as: Component = "button",
  intent = "primary",
  children,
}) => {
  const buttonClass = classNames("rounded ", {
    "mr-1 bg-red-500 hover:bg-red-700": intent === "Hapus",
    "mr-1 bg-blue-500 hover:bg-blue-700": intent === "Upload Nilai",
  });

  const getLeftIcon = () => {
    switch (intent) {
      case "Hapus":
        return <DeleteIcon fontSize="small" style={{ fill: "#ffffff" }} />;
      case "Upload Nilai":
        return <FileUploadIcon fontSize="small" style={{ fill: "#ffffff" }} />;
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
