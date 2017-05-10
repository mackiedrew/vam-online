// Render
import React, { Component } from "react";
import "../styles/Track.styl";

// State
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// Actions
import setTrackSampleRate from "../actions/setTrackSampleRate";
import setTrackGrains from "../actions/setTrackGrains";
import setSeekPosition from "../actions/setSeekPosition";

// Selectors
import maxAmplitudes from "../selectors/maxAmplitudes";

// Helpers
import { richReadWav } from "../help/wav";
import { determineWhichGrainsToShow } from "../help/grain";

// Components
import Waveform from "../components/Waveform";
import Loading from "../components/Loading";

// Containers
import TrackControls from "../containers/TrackControls";

/**
 * <Track /> should take in a simple path to a to a file and generate logical divisions and pass
 * down any display options to allow
 */
export class Track extends Component {
  constructor(props) {
    super(props);

    // Read wav data from provided path
    this.readPath();

    // Bind functions
    this.readPath = this.readPath.bind(this);
  }

  /**
   * Read important information from the wav file and place it into state. Or store an error.
   */
  readPath() {
    const {
      trackList,
      settings,
      id,
      setTrackSampleRate,
      setTrackGrains
    } = this.props;
    const { fileName, url } = trackList[id];
    return richReadWav(
      url,
      fileName,
      settings.grain.value,
      settings.quietCutoff.value
    ).then(({ sampleRate, grains }) => {
      setTrackSampleRate(id, sampleRate);
      setTrackGrains(id, grains);
    });
  }

  /**
   * Generate the in-line style object for programmatically determining the position of the
   * the seek line based on some % left of the screen taking into account the viewport.
   * 
   * @param {Object} view An object containing at least start and end keys.
   * @param {number} seekPosition Value of current position of seek in frames (aka samples).
   * @returns {Object} The new style object for in-line styling.
   */
  generateSeekLineStyle({ start, end }, seekPosition) {
    const seekPercentageInView = (seekPosition - start) / end * 100;
    const seekLineStyle = { left: `${seekPercentageInView}%` };
    return seekLineStyle;
  }

  render() {
    // Break out values for the sake of easier template reading
    const {
      selectedTrack,
      view,
      id,
      seekPosition,
      trackList,
      setSeekPosition,
      maxAmplitudes
    } = this.props;
    const track = trackList[id];
    const { grains, fileName } = track;
    const selected = selectedTrack === id;
    const maxAmplitude = maxAmplitudes[id];

    const grainsToShow = grains
      ? determineWhichGrainsToShow(grains, view, length)
      : grains;

    // Generate styles
    const seekLineStyle = this.generateSeekLineStyle(view, seekPosition);

    return (
      <div className="track" id={`track-${id}`}>
        <TrackControls id={id} name={fileName} />
        <div className="display">
          {grains ? "" : <Loading />}
          <div className="seek-line" style={seekLineStyle} />
          <Waveform
            grains={grainsToShow || []}
            maxAmplitude={maxAmplitude}
            selected={selected}
            setSeekPosition={setSeekPosition}
            view={view}
          />
        </div>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return {
    seekPosition: state.tracks.seekPosition,
    trackList: state.tracks.trackList,
    selectedTrack: state.tracks.selectedTrack,
    view: state.tracks.view,
    settings: state.settings,
    maxAmplitudes: maxAmplitudes(state)
  };
};

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setTrackSampleRate: setTrackSampleRate,
      setTrackGrains: setTrackGrains,
      setSeekPosition: setSeekPosition
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Track);
