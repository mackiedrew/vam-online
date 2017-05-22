// @flow

// Flow Types
import type { State, Dispatch, HotkeyValues } from "../constants/flowTypes";

// Render
import React, { Component } from "react";

// State
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Libraries
import keyboard from "keyboardjs";

// Actions
import toggleCurrentlyPlaying from "../actions/toggleCurrentlyPlaying";
import toggleSettingsMenu from "../actions/toggleSettingsMenu";

// Selectors
import getHotkeyValues from "../selectors/getHotkeyValues";

/**
 * Manages the operations and state of the keyboard hot keys and shortcuts.
 * 
 * @extends React.Component
 */
export class KeyboardManager extends Component {
  // Set flow types for class properties
  resetBindings: Function;
  createBindings: Function;
  manageBindings: Function;

  constructor(props: {
    hotkeyValues: HotkeyValues,
    toggleCurrentlyPlaying: Function,
    toggleSettingsMenu: Function
  }) {
    super(props);
    this.createBindings = this.createBindings.bind(this);
  }

  /**
   * Remove all existing keyboard bindings.
   */
  resetBindings() {
    keyboard.reset();
  }

  /**
   * Handle any binding creation operations.
   */
  createBindings() {
    const {
      hotkeyValues,
      toggleCurrentlyPlaying,
      toggleSettingsMenu
    }: {
      hotkeyValues: HotkeyValues,
      toggleCurrentlyPlaying: Function,
      toggleSettingsMenu: Function
    } = this.props;

    // Set actual actions (not necessarily redux actions) of hotkey events.
    const hotkeyOperations = {
      play: toggleCurrentlyPlaying,
      settings: toggleSettingsMenu
    };
    // Which keyboard operations currently have operations set?
    const setOperations: Array<string> = Object.keys(hotkeyOperations);
    /* 
     * What is the true full binding of each hotkey? This can be used to specify
     * more complex varieties that might otherwise be difficult to convey to 
     * users. You can keep something like "p" as an action but actually have
     * the back end of this operation be more complex like "p -> x + CRTL".
     */
    const fullBindings: HotkeyValues = {
      ...hotkeyValues
      // Add special varieties here: `play: hotkeyValues[play] + " -> x"`
    };
    // What are all the fully configured keyboard operations?
    const hotkeys = setOperations.map(operationName => {
      return {
        binding: fullBindings[operationName],
        operation: hotkeyOperations[operationName]
      };
    });
    // Create a new binding for any fully configured keyboard operations.
    hotkeys.forEach(
      ({
        binding,
        operation
      }: {
        binding: string,
        operation: Function
      }): void => {
        keyboard.bind(binding, operation);
      }
    );
  }

  /**
   * Gross order of subroutines for managing the keyboard bindings.
   */
  manageBindings() {
    this.resetBindings();
    this.createBindings();
  }

  render() {
    // Manage bindings through the gross bindings manager.
    this.manageBindings();
    // Return a token render for debugging, testings and tracking purposes.
    return <div className="keyboard-manager" />;
  }
}

export const makeMapStateToProps = () => {
  const mapStateToProps = (state: State) => ({
    hotkeyValues: getHotkeyValues(state)
  });
  return mapStateToProps;
};

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      toggleCurrentlyPlaying: toggleCurrentlyPlaying,
      toggleSettingsMenu: toggleSettingsMenu
    },
    dispatch
  );
};

export const mapStateToProps = makeMapStateToProps();

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardManager);
