import React from "react";
import Svg, { Path } from "react-native-svg";

const DocumentsMenuIcon = ({ isActive }: { isActive: boolean }) => {
    const color = isActive ? "#FF3200" : "#BEBEBE";
    return (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <Path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                stroke={color}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                stroke={color}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default DocumentsMenuIcon;
