const ErrorMessage = ({ message, setState }) => {
  return (
    <p
      className="bg-errorTrue/30 text-errorTrue p-2 text-[.5rem] cursor-pointer"
      onClick={() => setState(false)}
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
