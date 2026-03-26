import React from "react";
import Svg, { Path } from "react-native-svg";

const FinanceMenuIcon = ({ isActive }: { isActive: boolean }) => {
    const color = isActive ? "#FF3200" : "#BEBEBE";
    return (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                stroke={color}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default FinanceMenuIcon;
