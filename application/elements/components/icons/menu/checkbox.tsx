import React from "react";
import Svg, { Path } from "react-native-svg";

const CheckboxMenuIcon  = ({ isActive }: {isActive: boolean}) => {
    return (
        <Svg width="21" height="20" viewBox="0 0 21 20" fill="none" >
            <Path d="M6.8501 8.84961L9.8501 11.8496L19.8501 1.84961M18.8501 9.84961V16.8496C18.8501 17.38 18.6394 17.8887 18.2643 18.2638C17.8892 18.6389 17.3805 18.8496 16.8501 18.8496H2.8501C2.31966 18.8496 1.81096 18.6389 1.43588 18.2638C1.06081 17.8887 0.850098 17.38 0.850098 16.8496V2.84961C0.850098 2.31918 1.06081 1.81047 1.43588 1.4354C1.81096 1.06032 2.31966 0.849609 2.8501 0.849609H13.8501"
            stroke={isActive ? "#FF3200" : "#BEBEBE"} stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>


    )
};

export default CheckboxMenuIcon;