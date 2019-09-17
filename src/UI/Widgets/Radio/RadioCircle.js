import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from '../../Widgets';

import * as SIZE from '../../../Data/Constant/Size';

RadioCircle.defaultProps = {
    toggleStatus: false,
    action: null,
    iconSize: SIZE.fnt_4
};

RadioCircle.propTypes = {
    toggleStatus: PropTypes.any,
    action: PropTypes.any,
    iconSize: PropTypes.any
};

export function RadioCircle(props) {

    let {iconSize,children} = props;

    return (
        <Button
            buttonStyle={{paddingHorizontal: 5}}
            action={props.action}>
            <Icon
                iconSize={iconSize}
                iconType="material"
                iconName={((props.toggleStatus) ? "radio-button-checked" : "radio-button-unchecked")}/>
        </Button>
    )
}
