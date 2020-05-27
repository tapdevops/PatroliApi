import React from "react";
import PropTypes from "prop-types";
import {Container, Text} from "../../Widgets";

import * as COLOR from "../../../Data/Constant/Color";

RNBadge.defaultProps = {
    textColor: COLOR.WHITE,
    textSize: 11,

    badgePosition: "TOP-RIGHT",
    badgeColor: COLOR.RED,
    badgeLabel: null,
    badgeStyle: {},
};

RNBadge.propTypes = {
    textColor: PropTypes.any,
    textSize: PropTypes.any,

    badgePosition: PropTypes.oneOf(["TOP-RIGHT", "TOP-LEFT", "BOTTOM-LEFT", "BOTTOM-LEFT, ANY"]),
    badgeLabel: PropTypes.any,
    badgeStyle: PropTypes.any,
};

export default function RNBadge(props: Props) {

    const {
        textColor,
        textSize,
    } = props;

    const {
        badgeColor,
        badgeLabel,
        badgePosition,
        badgeStyle,
    } = props;


    const badgeStyles = [];
    badgeStyles.push({
        backgroundColor: badgeColor,
        width: 20,
        height: 20,
        alignItems:"center",
        justifyContent: 'flex-end',
        borderRadius: 10
    });

    if (badgePosition === "TOP-RIGHT") {
        badgeStyles.push({
            position: 'absolute',
            right: 0,
            top: 0,
        });
    }
    else if (badgePosition === "TOP-LEFT") {
        badgeStyles.push({
            left: 0,
            position: 'absolute',
            top: 0,
        });
    }
    else if (badgePosition === "BOTTOM-LEFT") {
        badgeStyles.push({
            bottom: 0,
            left: 0,
            position: 'absolute',
        });
    }
    else if (badgePosition === "BOTTOM-RIGHT") {
        badgeStyles.push({
            bottom: 0,
            position: 'absolute',
            right: 0,
        });
    }
    badgeStyles.push(badgeStyle);

    if (badgeLabel !== null && badgeLabel !== 0) {
        return (
            <Container style={badgeStyles}>
                <Text
                    style={{paddingTop: 3}}
                    textFontAlign={"right"}
                    textColor={textColor}
                    textLabel={badgeLabel}
                    textSize={textSize}
                />
            </Container>
        )
    }
    else {
        return null
    }
}
