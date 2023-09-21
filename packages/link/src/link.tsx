import * as React from "react";

type LinkElement = React.ElementRef<"a">;
type RootProps = React.ComponentPropsWithoutRef<"a">;

export type LinkProps = RootProps;

export const Link = React.forwardRef<LinkElement, Readonly<LinkProps>>(
  ({ target = "_blank", style, ...props }, forwardedRef) => (
    <a
      {...props}
      data-id="react-email-link"
      ref={forwardedRef}
      style={{
        color: "#067df7",
        textDecoration: "none",
        ...style,
      }}
      target={target}
    >
      {props.children}
    </a>
  ),
);

Link.displayName = "Link";
