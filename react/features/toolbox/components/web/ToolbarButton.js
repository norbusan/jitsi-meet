/* @flow */

import React from 'react';

import { Icon } from '../../../base/icons';
import { Tooltip } from '../../../base/tooltip';
import { NOTIFY_CLICK_MODE } from '../../constants';
import AbstractToolbarButton from '../AbstractToolbarButton';
import type { Props as AbstractToolbarButtonProps }
    from '../AbstractToolbarButton';

/**
 * The type of the React {@code Component} props of {@link ToolbarButton}.
 */
export type Props = AbstractToolbarButtonProps & {

    /**
     * The button's key.
     */
     buttonKey?: string,

    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string,

    /**
     * The text to display in the tooltip.
     */
    tooltip: string,

    /**
     * From which direction the tooltip should appear, relative to the
     * button.
     */
    tooltipPosition: string,

    /**
     * KeyDown handler.
     */
    onKeyDown?: Function
};

declare var APP: Object;

/**
 * Represents a button in the toolbar.
 *
 * @augments AbstractToolbarButton
 */
class ToolbarButton extends AbstractToolbarButton<Props> {
    /**
     * Default values for {@code ToolbarButton} component's properties.
     *
     * @static
     */
    static defaultProps = {
        tooltipPosition: 'top'
    };

    /**
     * Initializes a new {@code ToolbarButton} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._onKeyPress = this._onKeyPress.bind(this);
        this._onClick = this._onClick.bind(this);
    }

    _onKeyPress: (Object) => void;

    /**
     * Handles 'Enter' and Space key on the button to trigger onClick for accessibility.
     *
     * @param {Object} event - The key event.
     * @private
     * @returns {void}
     */
    _onKeyPress(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.props.onClick();
        }
    }
    _onClick: (Object) => void;

    /**
     * Handles button click.
     *
     * @param {Object} e - The key event.
     * @private
     * @returns {void}
     */
    _onClick(e) {
        const { buttonKey, notifyMode, onClick } = this.props;

        if (typeof APP !== 'undefined' && notifyMode) {
            APP.API.notifyToolbarButtonClicked(
                buttonKey, notifyMode === NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY
            );
        }

        if (notifyMode !== NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            onClick(e);
        }

        // blur after click to release focus from button to allow PTT.
        e && e.currentTarget && e.currentTarget.blur();
    }

    /**
     * Renders the button of this {@code ToolbarButton}.
     *
     * @param {Object} children - The children, if any, to be rendered inside
     * the button. Presumably, contains the icon of this {@code ToolbarButton}.
     * @protected
     * @returns {ReactElement} The button of this {@code ToolbarButton}.
     */
    _renderButton(children) {
        return (
            <div
                aria-label = { this.props.accessibilityLabel }
                aria-pressed = { this.props.toggled }
                className = 'toolbox-button'
                onClick = { this._onClick }
                onKeyDown = { this.props.onKeyDown }
                onKeyPress = { this._onKeyPress }
                role = 'button'
                tabIndex = { 0 }>
                { this.props.tooltip
                    ? <Tooltip
                        content = { this.props.tooltip }
                        position = { this.props.tooltipPosition }>
                        { children }
                    </Tooltip>
                    : children }
            </div>
        );
    }

    /**
     * Renders the icon of this {@code ToolbarButton}.
     *
     * @inheritdoc
     */
    _renderIcon() {
        return (
            <div className = { `toolbox-icon ${this.props.toggled ? 'toggled' : ''}` }>
                <Icon src = { this.props.icon } />
            </div>
        );
    }
}

export default ToolbarButton;
