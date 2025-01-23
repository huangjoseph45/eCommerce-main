const ErrorMessage = ({ message, setState }) => {
  return (
    <p
      className="bg-red-300 text-red-600 p-2 text-[.5rem] cursor-pointer"
      onClick={() => setState(false)}
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
