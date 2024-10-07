const ButtonPrimary = ({
    className,
    onClick,
    text,
  }: {
    className: string;
    onClick: () => void;
    text: string;
  }) => {
    return (
      <div
        className={`text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300 cursor-pointer ${className}`}
        onClick={onClick}
      >
        {text}
      </div>
    );
  };
  
  export default ButtonPrimary;
  