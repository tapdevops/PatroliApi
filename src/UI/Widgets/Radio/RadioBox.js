import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from '../../Widgets';

import * as SIZE from '../../../Data/Constant/Size';

RadioBox.defaultProps = {
    style: {},
    toggleStatus: false,
    action: null,
    iconSize: SIZE.fnt_4
};

RadioBox.propTypes = {
    style: PropTypes.any,
    toggleStatus: PropTypes.any,
    action: PropTypes.any,
    iconSize: PropTypes.any
};

export function RadioBox(props) {

    let {style, iconSize, toggleStatus} = props;

    return (
        <Button
            style={style}
            buttonDisabled={true}
            buttonStyle={{paddingHorizontal: 5}}
            action={props.action}>
            <Icon
                iconSize={iconSize}
                iconName={(toggleStatus) ? "check-box" : "check-box-outline-blank"}/>
        </Button>
    )
}