import './spectrum-analyzer.scss';
import React from 'react';

export default class SpectrumAnalyzer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bars: []
    };
  }

  componentDidMount() {
    if (navigator.mediaDevices) {
      console.log(`getUserMedia supported!`);
    } else {
      console.error(`getUserMedia not supported!`)
    }

    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      let audioCtx = new AudioContext();
      let source = audioCtx.createMediaStreamSource(stream);
      let analyser = audioCtx.createAnalyser();

      analyser.fftSize = this.props.bars * 2;
      analyser.minDecibels = -100;
      analyser.maxDecibels = 0;
      analyser.smoothingTimeConstant = 0.8;

      let bufferLength = analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);

      source.connect(analyser); // connect mic to analyser
      // source.connect(audioCtx.destination); // connect mic to "speaker"

      let loop = () => {
        requestAnimationFrame(loop);

        analyser.getByteFrequencyData(dataArray);

        // console.log(dataArray[0]);

        let bars = [];
        let barWidth = this.props.width / this.props.bars;

        for (let i = 0; i < this.props.bars; i++) {
          bars.push(`${i * barWidth},${this.props.height} ${i * barWidth + barWidth - 1},${this.props.height} ${i * barWidth + barWidth - 1},${this.props.height - dataArray[i] / 2} ${i * barWidth},${this.props.height - dataArray[i] / 2}`)
        }

        this.setState({
          bars: bars
        });
      }

      loop();
    });
  }

  render() {
    let bars = this.state.bars.map((points, index) => {
      return (
        <polygon key={index} points={points} />
      );
    })
    return (
      <div className="spectrum-analyzer">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox={`0 0 ${this.props.width} ${this.props.height}`}>
          { bars }
        </svg>
      </div>
    );
  }
}

SpectrumAnalyzer.defaultProps = {
  bars: 16,
  width: 128,
  height: 64
};
