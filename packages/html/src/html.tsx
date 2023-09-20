import * as React from "react";

type HtmlElement = React.ElementRef<"html">;
type RootProps = React.ComponentPropsWithoutRef<"html">;

export type HtmlProps = RootProps;

export const Html = React.forwardRef<HtmlElement, Readonly<HtmlProps>>(
  ({ children, lang = "en", dir = "ltr", ...props }, forwardedRef) => (
    <html
      {...props}
      dir={dir}
      id="__react-email"
      lang={lang}
      ref={forwardedRef}
    >
      {children}
    </html>
  )
);

Html.displayName = "Html";
