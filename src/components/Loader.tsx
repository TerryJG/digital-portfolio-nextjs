export default function Loader({className, spinnerClassName, spinnerStyles, textClassName, text, children}: {className?:string; spinnerClassName?:string; spinnerStyles?:React.CSSProperties; textClassName?:string, text?:string | React.ReactNode; children?:React.ReactNode}) {
  return (
    <div className={`${className} p-4`}>
      <div style={spinnerStyles} className={`${spinnerClassName} ${!spinnerClassName || !spinnerStyles ? "border-gray-400" : ""} animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4`}></div>
      <p className={`${textClassName ? textClassName : "text-gray-400"} text-center`}>{text ? text : "Loading projects..."}</p>
      {children}
    </div>
  );
}
