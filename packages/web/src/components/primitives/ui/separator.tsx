import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className: string;
  separatorColor?: string;
};

const Separator = ({ children, className, separatorColor }: Props) => {
  return (
    <div className={cn("w-full  px-2 flex", className)}>
      <span className={cn("border-t grow", separatorColor)} />
      <span className="text-center text-xs  bg-inherit opacity-100 -mt-2 mx-4">
        {children}
      </span>
      <span className={cn("border-t grow", separatorColor)} />
    </div>
  );
};

export { Separator };
export default Separator;
