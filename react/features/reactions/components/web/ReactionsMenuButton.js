// @flow

import React, { useCallback } from 'react';

import { isMobileBrowser } from '../../../base/environment/utils';
import { translate } from '../../../base/i18n';
import { IconArrowUp, IconRaisedHand } from '../../../base/icons';
import { getLocalParticipant, hasRaisedHand } from '../../../base/participants';
import { connect } from '../../../base/redux';
import { ToolboxButtonWithIcon } from '../../../base/toolbox/components';
import ToolbarButton from '../../../toolbox/components/web/ToolbarButton';
import { toggleReactionsMenuVisibility } from '../../actions.web';
import { type ReactionEmojiProps } from '../../constants';
import { getReactionsQueue, isReactionsEnabled } from '../../functions.any';
import { getReactionsMenuVisibility } from '../../functions.web';

import ReactionEmoji from './ReactionEmoji';
import ReactionsMenuPopup from './ReactionsMenuPopup';

type Props = {

    /**
     * Whether or not reactions are enabled.
     */
    _reactionsEnabled: Boolean,

    /**
     * The button's key.
     */
     buttonKey?: string,

    /**
     * Redux dispatch function.
     */
    dispatch: Function,

    /**
     * Click handler for raise hand functionality.
     */
    handleClick: Function,

    /**
     * Whether or not the reactions menu is open.
     */
    isOpen: boolean,

    /**
     * Whether or not it's a mobile browser.
     */
    isMobile: boolean,

    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string,


    /**
     * Whether or not the local participant's hand is raised.
     */
    raisedHand: boolean,

    /**
     * The array of reactions to be displayed.
     */
    reactionsQueue: Array<ReactionEmojiProps>,

    /**
     * Used for translation.
     */
    t: Function
};


declare var APP: Object;

/**
 * Button used for the reactions menu.
 *
 * @returns {ReactElement}
 */
function ReactionsMenuButton({
    _reactionsEnabled,
    buttonKey,
    dispatch,
    handleClick,
    isOpen,
    isMobile,
    notifyMode,
    raisedHand,
    reactionsQueue,
    t
}: Props) {
    const toggleReactionsMenu = useCallback(() => {
        dispatch(toggleReactionsMenuVisibility());
    }, [ dispatch ]);

    const raiseHandButton = (<ToolbarButton
        accessibilityLabel = { t('toolbar.accessibilityLabel.raiseHand') }
        buttonKey = { buttonKey }
        icon = { IconRaisedHand }
        key = { buttonKey }
        notifyMode = { notifyMode }
        onClick = { handleClick }
        toggled = { raisedHand }
        tooltip = { t('toolbar.raiseHand') } />);

    return (
        <div className = 'reactions-menu-popup-container'>
            <ReactionsMenuPopup>
                {!_reactionsEnabled || isMobile ? raiseHandButton
                    : (
                        <ToolboxButtonWithIcon
                            ariaControls = 'reactions-menu-dialog'
                            ariaExpanded = { isOpen }
                            ariaHasPopup = { true }
                            ariaLabel = { t('toolbar.accessibilityLabel.reactionsMenu') }
                            buttonKey = { buttonKey }
                            icon = { IconArrowUp }
                            iconDisabled = { false }
                            iconId = 'reactions-menu-button'
                            iconTooltip = { t(`toolbar.${isOpen ? 'closeReactionsMenu' : 'openReactionsMenu'}`) }
                            notifyMode = { notifyMode }
                            onIconClick = { toggleReactionsMenu }>
                            {raiseHandButton}
                        </ToolboxButtonWithIcon>
                    )}
            </ReactionsMenuPopup>
            {reactionsQueue.map(({ reaction, uid }, index) => (<ReactionEmoji
                index = { index }
                key = { uid }
                reaction = { reaction }
                uid = { uid } />))}
        </div>
    );
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    const localParticipant = getLocalParticipant(state);

    return {
        _reactionsEnabled: isReactionsEnabled(state),
        isOpen: getReactionsMenuVisibility(state),
        isMobile: isMobileBrowser(),
        reactionsQueue: getReactionsQueue(state),
        raisedHand: hasRaisedHand(localParticipant)
    };
}

export default translate(connect(mapStateToProps)(ReactionsMenuButton));
