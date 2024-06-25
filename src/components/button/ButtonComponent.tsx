import React from "react";
import classNames from "classnames";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";

interface ButtonProps {
  leftIcon?: JSX.Element;
  as?: React.ElementType;
  intent?: "primary-full";
  loading?: boolean;
  children?: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  as: Component = "button",
  intent = "primary",
  children,
  loading = false,
}) => {
  const buttonClass = classNames("rounded ", {
    "w-full relative inline-flex items-center justify-center px-5 py-2 mb-1 me-2 overflow-hidden text-sm font-medium text-white group bg-black-primary":
      intent === "primary-full",
  });

  const getLeftIcon = () => {
    switch (intent) {
      default:
        return null;
    }
  };

  return (
    <Component type="submit" className={buttonClass} disabled={loading}>
      {loading ? (
        <CircularProgress size="1.2rem" style={{ color: "#ffffff" }} />
      ) : (
        <>
          {getLeftIcon() && (
            <IconButton aria-label={intent} size="small">
              {getLeftIcon()}
            </IconButton>
          )}
          {children}
        </>
      )}
    </Component>
  );
};

export default ButtonComponent;
