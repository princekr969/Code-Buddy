
export const Card = ({ children, className }) => {
  return (
    <div className={`shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return <div className={`p-2 ${className}`}>{children}</div>;
};
