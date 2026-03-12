import React from "react";
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg";

const GlobeIcon = () => {
    return (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <G clipPath="url(#clip0_3137_13053)">
            <Path d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5M16.5 9C16.5 4.85786 13.1421 1.5 9 1.5M16.5 9H1.5M9 16.5C4.85786 16.5 1.5 13.1421 1.5 9M9 16.5C10.876 14.4462 11.9421 11.781 12 9C11.9421 6.21903 10.876 3.55376 9 1.5M9 16.5C7.12404 14.4462 6.05794 11.781 6 9C6.05794 6.21903 7.12404 3.55376 9 1.5M1.5 9C1.5 4.85786 4.85786 1.5 9 1.5" stroke="#3C0878" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </G>
            <Defs>
            <ClipPath id="clip0_3137_13053">
            <Rect width="18" height="18" fill="white"/>
            </ClipPath>
            </Defs>
        </Svg>
    )
};

export default GlobeIcon;