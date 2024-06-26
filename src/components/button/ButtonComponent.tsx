import React from "react";
import classNames from "classnames";
import { IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";

interface ButtonProps {
  leftIcon?: JSX.Element;
  as?: React.ElementType;
  intent?:
    | "primary-full"
    | "primary-small"
    | "secondary-small"
    | "primary-small-icon";
  loading?: boolean;
  children?: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  as: Component = "button",
  intent = "primary",
  children,
  loading = false,
  leftIcon,
}) => {
  const buttonClass = classNames(
    "rounded relative inline-flex items-center justify-center overflow-hidden text-sm font-medium px-2 mb-1",
    {
      "py-2 w-full text-white group bg-black-primary":
        intent === "primary-full",
      "py-2 gap-x-1 w-min-25 text-white group bg-black-primary hover:bg-black-secondary":
        intent === "primary-small",
      "group border border-2 border-black-primary text-black-primary hover:border-black-secondary hover:text-black-secondary py-1.5":
        intent === "secondary-small",
    }
  );

  return (
    <Component type="submit" className={buttonClass} disabled={loading}>
      {loading ? (
        <CircularProgress size="1.2rem" style={{ color: "#ffffff" }} />
      ) : (
        <>
          {leftIcon && <div aria-label={intent}>{leftIcon}</div>}
          {children}
        </>
      )}
    </Component>
  );
};

export default ButtonComponent;
