type BaseDividerProps = {
  id?: string;
  className?: string;
  overrideClassName?: string;
};

type DividerMarginProps = BaseDividerProps & {
  margin: true;
  spacing: number;
  padding?: never;
};

type DividerPaddingProps = BaseDividerProps & {
  padding: true;
  spacing: number;
  margin?: never;
};

type DividerProps = DividerMarginProps | DividerPaddingProps;

export function Divider({ id, className = "", overrideClassName, spacing, ...props }: DividerProps) {
  const isMargin = "margin" in props && props.margin;
  const spacingStyle = isMargin ? { marginTop: `${spacing}rem`, marginBottom: `${spacing}rem` } : { paddingTop: `${spacing}rem`, paddingBottom: `${spacing}rem` };

  const baseClassName = "w-full";
  const finalClassName = overrideClassName || `${baseClassName} ${className}`.trim();

  return <div id={id} className={finalClassName} style={spacingStyle} />;
}
