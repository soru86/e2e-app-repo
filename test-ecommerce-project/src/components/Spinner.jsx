import { ClipLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "0 auto",
};

const Spinner = ({ loading, color = "#5ece7b", size = 100 }) => {
    return (
        <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={size}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    );
};

export default Spinner;
