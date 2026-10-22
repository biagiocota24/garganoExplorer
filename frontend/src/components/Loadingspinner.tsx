import { Spinner } from "react-bootstrap";

interface PropsInterface {
  text: string;
  variant: "primary" | "success" | "danger" | "warning";
}

const LoadingSpinner = ({ text, variant }: PropsInterface) => {
  return (
    <div className="text-center mt-5">
      <h2 className={`text-${variant}`}>{text}</h2>
      <Spinner variant={variant} />
    </div>
  );
};

export default LoadingSpinner;
