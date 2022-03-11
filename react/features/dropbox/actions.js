// @flow
import { UPDATE_DROPBOX_TOKEN } from './actionTypes';
import { _authorizeDropbox } from './functions';
import logger from './logger';

/**
 * Action to authorize the Jitsi Recording app in dropbox.
 *
 * @returns {Function}
 */
export function authorizeDropbox(nextCloudURL, nextCloudClientID, nextCloudSecret) {
    return (dispatch: Function, getState: Function) => {
        const state = getState();
        const { locationURL } = state['features/base/connection'];
        const { dropbox = {} } = state['features/base/config'];

        dropbox.redirectURI = `${locationURL.origin}/static/oauth.html`;

        // By default we use the static page on the main domain for redirection.
        // So we need to setup only one redirect URI in dropbox app
        // configuration (not multiple for all the tenants).
        // In case deployment is running in subfolder dropbox.redirectURI
        // can be configured.
        const redirectURI
            = dropbox.redirectURI || `${locationURL.origin}/static/oauth.html`;

        const config = {
            oAuthURL: `${nextCloudURL}/index.php/apps/oauth2/authorize`,
            tokenURL: 'https://cloud.preining.info/index.php/apps/oauth2/api/v1/token',
            clientID: nextCloudClientID,
            secret: nextCloudSecret,
            redirectURL: 'https://meet.preining.info/static/oauth.html'
        }

        const oauthLoginChannel = new BroadcastChannel('oauthLoginChannel')
        oauthLoginChannel.onmessage = async e => {
            const code = e.data
            try {
                console.log('return the auth code')

                const params = {
                    grant_type: "authorization_code",
                    client_id: config.clientID,
                    client_secret: config.secret,
                    redirect_uri: config.redirectURL,
                    code: code,
                }

                const response = await fetch(config.tokenURL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8",
                            "Origin": `${locationURL.origin}`,
                            "Referer": `${locationURL.origin}`
                        },
                        body: JSON.stringify(params)
                    }).then(response => {
                    return !!response ? response.json() : undefined;
                }).catch(e => {
                    // TODO: CORS error handling
                })
                console.log(response)

            } catch (e) {
                console.error('Failed to authenticate with received token', code, e)
                //ui.error = (e as Error).message
            }
            //ui.loginLoading = false
        }

        // Open popup window with OAuth provider page
        const width = 600, height = 600
        const left = window.innerWidth / 2 - width / 2
        const top = window.innerHeight / 2 - height / 2


        const param = `response_type=code&client_id=${config.clientID}&redirect_uri=${config.redirectURL}`
        window.open(
            `${config.oAuthURL}?${param}`,
            '',
            `toolbar=no, location=no, directories=no, status=no, menubar=no,
    scrollbars=no, resizable=no, copyhistory=no, width=${width},
    height=${height}, top=${top}, left=${left}`,
        )

    };

}

/**
 * Action to update the dropbox access token.
 *
 * @param {string} token - The new token.
 * @param {string} rToken - The refresh token.
 * @param {number} expireDate - The token expiration date as UNIX timestamp.
 * @returns {{
 *     type: UPDATE_DROPBOX_TOKEN,
 *     token: string,
 *     rToken: string,
 *     expireDate: number
 * }}
 */
export function updateDropboxToken(token: string, rToken: string, expireDate: number) {
    return {
        type: UPDATE_DROPBOX_TOKEN,
        token,
        rToken,
        expireDate
    };
}

