import clsx from "clsx"
import React from "react";

interface ContainerProps {
    fluid: boolean;
    children: React.ReactNode;
}

function Container({ fluid, children }: ContainerProps) {
  return (
    <div className={clsx('mx-auto px-4 lg:px-6 w-11/12', fluid && 'max-w-screen-xl w-full')}>
        { children }
    </div>
  )
}

export default Container