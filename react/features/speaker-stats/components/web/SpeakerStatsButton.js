// @flow

import { createToolbarEvent, sendAnalytics } from '../../../analytics';
import { openDialog } from '../../../base/dialog';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { NOTIFY_CLICK_MODE } from '../../../toolbox/constants';
import AbstractSpeakerStatsButton from '../AbstractSpeakerStatsButton';

import { SpeakerStats } from './';

/**
 * Implementation of a button for opening speaker stats dialog.
 */
class SpeakerStatsButton extends AbstractSpeakerStatsButton {

    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, handleClick, notifyMode } = this.props;

        if (handleClick) {
            handleClick();
        }

        if (notifyMode === NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY) {
            return;
        }

        sendAnalytics(createToolbarEvent('speaker.stats'));
        dispatch(openDialog(SpeakerStats));
    }
}

export default translate(connect()(SpeakerStatsButton));
