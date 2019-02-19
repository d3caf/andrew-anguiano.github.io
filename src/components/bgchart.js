import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Label, Tooltip } from 'recharts';
import { format } from 'date-fns';
import { debounce as _debounce } from 'lodash';

import styles from './bgchart.module.scss';

const chartStyles = {
  axes: {
    strokeWidth: 2,
    stroke: 'currentcolor',
    tickSize: 4,
  }
};

class BgChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgEntries: [],
      loading: true
    };

    this.handleTooltip = _debounce(this.handleTooltip, 250);
  }

  componentDidMount() {
    this.refreshBgData();
    this.refreshTimer = setInterval(() => this.refreshBgData(true), 32400);
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  formatEntries = entries => (
    entries.map(entry => ({
      time: format(entry.date, 'h:mma'),
      value: entry.sgv
    })).reverse()
  );

  fetchRecentBg = async () => {
    try{
      const res = await fetch('https://bg.andrewanguiano.com/api/v1/entries.json?count=25');
      const body = await res.json();

      if(!res.ok) {
        throw res.error();
      }

      return this.formatEntries(body);

    } catch (err) {
      console.error(err)
    }
  };

  refreshBgData = async (silent = false) => {
    if(!silent) {
      this.setState({
        loading: true
      });
    }

    const bgEntries = await this.fetchRecentBg();

    this.setState({
      bgEntries,
      loading: false
    }, () => this.props.bgFetchedCallback && this.props.bgFetchedCallback(bgEntries));
  };

  handleTooltip = ({payload}) => {
    this.props.onTooltip && this.props.onTooltip(payload);
  };

  render() {
    const { bgEntries, loading } = this.state;
    return (
      !loading ? (
        <ResponsiveContainer height={300}>
         <LineChart className={styles.chart} data={bgEntries}>
           <XAxis dataKey="time" interval={2} padding={{right: 30}} tick={{dy: 4}} {...chartStyles.axes} />
           <YAxis datakey="value" domain={['dataMin', 'dataMax']} padding={{bottom: 30}} tick={{dx: -4}} {...chartStyles.axes} >
             <Label value="mg/dL" angle={-90} dx={-20} style={{fontWeight: 'normal'}} />
           </YAxis>
           <Line type="monotone" dataKey="value" stroke="#51e18b" strokeWidth={3} strokeLinecap="round" dot={false} animationDuration={1000} />
           <Tooltip active={false} content={(props) => this.handleTooltip(props)} />
         </LineChart>
        </ResponsiveContainer>
        ) : <div style={{height: 300, width: '100%'}} />
      )
  }
}

export default BgChart;
