import { ReactNode, forwardRef, ButtonHTMLAttributes, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  // className?: HTMLAttributes<HTMLButtonElement>["className"];
  onClickHandler: () => void;
};

const Button = forwardRef<HTMLButtonElement, Props>((props: Props, ref) => {
  const {className, disabled, type="button", children, onClickHandler, ...rest} = props;

  // if (ref && typeof ref !== "function") {
  //   console.log("Clicked")
  // };

  return (
    <button
      ref={ref}
      className={twMerge("w-max px-3 py-2 font-bold text-black border border-transparent rounded-full bg-green-500 transition-all hover:opacity-75 disabled:opacity-60 disabled:cursor-not-allowed", className)}
      type={type}
      disabled={disabled}
      onClick={onClickHandler}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;