import React, {Component} from "react";
import "../selectable.css";
import "./IconSelection.css";
import Cookies from 'js-cookie';
// import {TwitterShareButton} from 'react-twitter-embed';
import portraits, {unlockedPortraits, lockedPortraits, defaultPortrait} from "../assets";
import {portraitsAltText} from "../assets";

import {
    COMMAND_SELECT_ICON,
    PARAM_ICON
} from "../GlobalDefinitions";
import PropTypes from "prop-types";
// import ButtonPrompt from "./ButtonPrompt";

export const UNLOCK_ICONS_COOKIE_NAME = "_unlock_icons";

class IconSelection extends Component {

    constructor(props) {
        super(props);

        // Check if the locked icons prompt should be shown. (using cookies!)
        let hasUserUnlockedIcons = false;
        if (Cookies.get(UNLOCK_ICONS_COOKIE_NAME)) {
            hasUserUnlockedIcons = true;
        }

        this.state = {
            unlockLockedIcons: hasUserUnlockedIcons,
            showLockedPrompt: !hasUserUnlockedIcons
        };

        this.onConfirmButtonClick = this.onConfirmButtonClick.bind(this);
        this.getIconButtonHML = this.getIconButtonHML.bind(this);
        this.isIconInUse = this.isIconInUse.bind(this);
        this.onClickUnlock = this.onClickUnlock.bind(this);
        this.addTwitterHooks = this.addTwitterHooks.bind(this);
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutID)
    }


    isIconInUse(iconID) {
        let playerOrder = this.props.players;
        for (let i = 0; i < playerOrder.length; i++) {
            let player = playerOrder[i];
            if (this.props.playerToIcon[player] === iconID) {
                return true;
            }
        }
        return false;
    }


    onClickIcon(iconID) {
        // Verify that player is able to select this icon.
        let isPremium = lockedPortraits.indexOf(iconID) !== -1;
        // Also does not allow selection if user has already selected this icon
        let unselectable = ((isPremium && !this.state.unlockLockedIcons) || (this.isIconInUse(iconID)));

        if (!unselectable) { // This is a valid choice according to our current game state
            // Register the selection with the server.
            // Contact the server using provided method.
            let data = {};
            data[PARAM_ICON] = iconID;
            this.props.sendWSCommand(COMMAND_SELECT_ICON, data);
        }
    }

    /**
     * Called when any icon is clicked.
     * @effects Attempts to send the server a command with the player's vote, and locks access to the button
     *          for {@code SERVER_TIMEOUT} ms.
     */
    onConfirmButtonClick() {
        // Check that user has a profile picture assigned according to the game state
        if (this.props.playerToIcon[this.props.user] !== defaultPortrait) {
            this.props.onConfirm();
        }
    }

    getIconButtonHML(portraitNames) {
        let iconHTML = [];
        // Update selections based on game state given by the server (this prevents duplicate player icons).

        let currPortrait = this.props.playerToIcon[this.props.user];

        portraitNames.forEach(portraitID => {
            // Check if valid portrait name
            if (portraits.hasOwnProperty(portraitID)) {
                // Disable locked icons or icons currently selected by other players.
                let isIconAvailable  = !this.isIconInUse(portraitID) || portraitID === currPortrait;
                let isIconUnlocked = lockedPortraits.indexOf(portraitID) === -1 || this.state.unlockLockedIcons;
                let isEnabled = isIconUnlocked && isIconAvailable;
                let isSelected = currPortrait === portraitID;
                iconHTML.push(
                    <img id={"icon"}
                         className={"selectable"
                                        + (isSelected ? " selected" : "")
                                        + (!isEnabled ? " disabled" : "")} // Determines if selected / selectable
                         alt={portraitsAltText[portraitID]}
                         src={portraits[portraitID]}
                         draggable={false}
                         onClick={()=>this.onClickIcon(portraitID)}
                    >
                    </img>
                );
            }
        });

        // Return all the icons in a div container.
        return (
            <div id={"icon-container"}>
                {iconHTML}
            </div>
        );
    }

    onClickUnlock() {
        // Unlock the icons
        this.setState({unlockLockedIcons: true});
        // Set cookie signaling that this action has occurred, which gives the player a different
        // icon selection screen on the next load.
        Cookies.set(UNLOCK_ICONS_COOKIE_NAME, "true", {expires: 365});
        // Callback for analytics logging
        this.props.onClickTweet();
    }

    addTwitterHooks() {
        // window.twttr.events.bind('tweet', this.onClickUnlock);
    }


    render() {
        let headerPortraits;
        if (this.state.showLockedPrompt) {
            headerPortraits = unlockedPortraits;
        } else {
            headerPortraits = unlockedPortraits.concat(lockedPortraits);
        }
        let done = false;
        headerPortraits.map((portraitID, index) => {
            let currPortrait = this.props.playerToIcon[this.props.user];
            if (!done && (!this.isIconInUse(portraitID) || portraitID === currPortrait)) {
                this.onClickIcon(portraitID);
                this.onConfirmButtonClick();
                done=true;
            }
            return true;
        })
        return <></>
    }

}

IconSelection.defaultProps = {
    onClickTweet: () => {},
    onClickFBShare: () => {},
};

IconSelection.propTypes = {
    playerToIcon: PropTypes.object.isRequired,
    players: PropTypes.array.isRequired,
    sendWSCommand: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClickTweet: PropTypes.func,
    onClickFBShare: PropTypes.func,
};

export default IconSelection;