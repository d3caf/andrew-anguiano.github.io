import React, { Component } from "react"

import { graphql } from 'gatsby';
import SEO from "../components/seo"

import BgChart from '../components/bgchart';
import indexStyles from './index.module.scss';

class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestBg: null,
      hoveredBg: null,
      hoveredTime: null
    }
  }

  handleBgFetched = bgData => {
    this.setState({
      latestBg: bgData[bgData.length - 1]
    });
  };

  handleTooltip = props => {
    if(props && props.length && props[0].payload){
      this.setState({
        hoveredBg: props[0].payload.value || '--',
        hoveredTime: props[0].payload.time || ''
      })
    }
    if(props && !props.length) {
      this.setState({
        hoveredBg: null,
        hoveredTime: null
      })
    }
  };

  render() {
    return (
      <div className={indexStyles.wrapper}>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />

        <div className={indexStyles.titleContainer}>
          <h1>Andrew Anguiano</h1>
          <br />
          <span className={indexStyles.subTitle}>Builds Things on the Internet</span>
        </div>

        <div className={indexStyles.introTextContainer}>
          <p><strong>andrew@127.0.0.1/~ ></strong> Hi, I'm Andrew. I'm a 26 year old web developer living in the beautiful Midwest. I'm currently employed as a UI Engineer with <a href="https://www.amobee.com" target="_blank" rel="noreferrer noopener" style={{color: '#00b2cc'}}>Amobee</a>. </p>
          <p><strong>andrew@127.0.0.1/~ ></strong> I love coffee, Vim, games, React, my little family, and many other very interesting and exciting things. Also, my pancreas doesn't work, so I've replaced it with a <a href="https://github.com/loopkit/loop" target="_blank" rel="noreferrer noopener">bionic one</a>.</p>
          <p><strong>andrew@127.0.0.1/~ ></strong> I'm always open to side projects, so feel free to drop me a note.</p>
        </div>

        <div className={indexStyles.toolsContainer}>
          {this.props.data.allFile.edges.map(({node}, i) => <img key={i} src={node.publicURL} alt={node.title} />)}
        </div>

        <div style={{width: '100%'}}>
          <h1 style={{textAlign: 'center', margin: 0, marginBottom: '.25em'}}>bionic pancreas stats</h1>
          <p style={{textAlign: 'center', fontStyle: 'italic', margin: 0, marginBottom: '2rem'}}>This is live data coming from my artificial pancreas system running Loop.</p>
          <div className={indexStyles.bgContainer}>
            <div>
              <BgChart bgFetchedCallback={bgData => this.handleBgFetched(bgData)} onTooltip={this.handleTooltip} />
            </div>
            <div className={`${indexStyles.bgLatestContainer} ${!!(this.state.hoveredBg || this.state.hoveredTime) ? indexStyles.historical : ''}`}>
              {this.state.latestBg && (
                <h1>
                  {this.state.hoveredBg || this.state.latestBg.value}<sup>mg/dL</sup>
                  <small>{this.state.hoveredTime || this.state.latestBg.time}</small>
                </h1>
                )}
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export const query = graphql`
    query {
        allFile(filter: {relativeDirectory: {eq: "logos"}, extension: {regex: "/(svg)/"}}, sort: {fields: name, order: ASC}) {
            edges {
                node {
                    name
                    publicURL
                }
            }
        }
    }
`;

export default IndexPage
