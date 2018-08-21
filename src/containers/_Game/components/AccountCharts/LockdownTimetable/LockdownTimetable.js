import React, { Component } from "react";
import PropTypes from "prop-types";
import { toWordedDate, toSlashDate } from "../../../../../util";
import classes from "./LockdownTimetable.css";
import Spinner from "../../../../../components/UI/Spinner/Spinner";
import axios from "../../../../../axios-gsm";
import chipIcon from "../../../../../assets/images/chip-icon.png";
import lossIcon from "../../../../../assets/images/loss-icon.png";
import gainIcon from "../../../../../assets/images/gain-icon.png";
import ReactTable from "react-table";
import tableClasses from "react-table/react-table.css";
import * as actions from "../../../../../store/actions";
import Markets from "../../../../Markets/Markets"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from "recharts";

import { connect } from "react-redux";

const stateToProps = state => ({
  performance_account_id: state.betting.performance_account_id,
  email: state.auth.email,
  liveDateText:state.betting.liveDateText,
  timetable_dialog:state.betting.timetable_dialog,
  themes:state.betting.themes,
  

});


const dispatchToProps = dispatch => {
  return {
    initializeHeatmap:(account_id, link, sym) => {
      dispatch(actions.initializeHeatmap(account_id, link, sym))
    },
    showHtmlDialog3: (htmlContent) => {
      dispatch(actions.showHtmlDialog3(htmlContent));
      
    },
    silenceHtmlDialog3: () => {
      dispatch(actions.silenceHtmlDialog3());
      
    },
    
  };
};

const convert = pnlObj => {
  return {
    pnl: Number(pnlObj.pnl).toFixed(2),
    cumulative: (pnlObj.cumulative * 100).toFixed(2),
    changePercent: (pnlObj.changePercent * 100).toFixed(2)
  };
};

const RED = "#e12f48",
  BLUE = "#8884d8",
  GREEN = "#63a57c";


@connect(stateToProps, dispatchToProps)
export default class LockdownTimetable extends Component {
  static propTypes = {
   
    //performance: PropTypes.object,
    //position: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    performance_account_id: PropTypes.string.isRequired,
    email:PropTypes.string.isRequired,
    liveDateText:PropTypes.string.isRequired,
    timetable_dialog:PropTypes.object.isRequired,
    toggle:PropTypes.func,
    initializeHeatmap:PropTypes.func.isRequired,
    gap:PropTypes.number,
    themes:PropTypes.object.isRequired,
    showHtmlDialog3:PropTypes.func.isRequired,
    silenceHtmlDialog3:PropTypes.func.isRequired,

  };

  constructor(props) {
    super(props);


    this.state = {
      lookback: '',
      performance:{},
      performanceLoading:true,
      performanceError:'',
      // endDate: 20180201
    };
  }

  lookbackHandler = lookback => {
    this.setState({ lookback });
  };

  xTick({ payload, x, y }) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" transform="rotate(-45)">
          {payload.value}
        </text>
      </g>
    );
  }

  componentDidMount() {
      var self=this;
   

     if (self.props.chip && self.props.chip.account_id) {
      axios
      .post("/utility/timetables_live/", {
        /**
         * @example {"portfolio": ["TU", "BO"], "systems": ["prev1", "prev5"], "target": 500, "account": 5000}
         *
         */
        account_id: self.props.chip.account_id
      })
      .then(response => {
        /**
         * @namespace {Performance}
         */
        var performance = response.data;
        if (performance.data_not_available) {
          var performanceError=performance.data_not_available_message;
          this.setState({
            performanceLoading: false,
            performanceError: performanceError
          });
        } else {
          console.log('timetable data')
          console.log(performance);
          var title='';
          if (performance.title)
            title=performance.title;
          var dataJson= JSON.parse(performance.timetable_dialog);
          performance.timetable_dialog=dataJson;
          performance=dataJson;

          var close_text=performance.close_text   ;
          var group=performance.group;
          var text_color=performance.text_color;
          var trigger_text=performance.trigger_text;
          var qty=performance.qty;
          var data=[];
          self.hasQty=true;
        
          Object.keys(group).map(key => {
              var item={};
              var color=text_color[key];
              if (!color)
                  color='black';
              item.Markets=key;
              item.Group=group[key] //{'Value':group[key],'Color':color};
              item.Next_Trigger=trigger_text[key] //{'value':trigger_text[key],'color':color};
              item.Next_Close=close_text[key] //{'value':close_text[key],'color':color};
              item.Color=color;
              item.qty=qty[key];
              data.push(item);

          })
          console.log(performance);

          this.setState({
              performanceLoading: false,
              performance:data,
              title:title
            });
          }
      })
      .catch(performanceError => {
        console.log(performanceError);
        this.setState({
          performanceLoading: false,
          performanceError: performanceError
        });
      });
    } else {
      
      var performance=self.props.timetable_dialog;
      console.log(performance);
      var close_text=performance.close_text   ;
      var group=performance.group;
      var text_color=performance.text_color;
      var trigger_text=performance.trigger_text;
      var data=[];
      self.hasQty=false;
     
      if (group) {
        Object.keys(group).map(key => {
            var item={};
            var color=text_color[key];
            if (!color)
                color='black';
            item.Markets=key;
            item.Group=group[key] //{'Value':group[key],'Color':color};
            item.Next_Trigger=trigger_text[key] //{'value':trigger_text[key],'color':color};
            item.Next_Close=close_text[key] //{'value':close_text[key],'color':color};
            item.Color=color;
            data.push(item);
    
        })
      }
      
      console.log('data');
      console.log(data);
      this.setState({
      performanceLoading: false,
      performance:data
       });
    }
  }

  render() {
    var self=this;
    var { performance, lookback, performanceLoading, performanceError } = this.state;
    var bgColor="white";
    var bgText="black";
    var bdColor="green";
    var bhColor="pink";
    /*if (this.props.themes.live.dashboard != undefined) {
      bgColor=this.props.themes.live.dashboard.background;
      bgText=this.props.themes.live.dashboard.text;
      bdColor=this.props.themes.live.dashboard.lines;
      bhColor=this.props.themes.live.dashboard.lines_horizontal_middle;
    }
    */
    var adjHeight=0;
    if (self.props.gap != undefined)
      adjHeight+=self.props.gap;
    var tableStyle={ fontSize:'12px',background: bgColor, color:bgText, borderLeft: "1px solid " + bdColor, borderRight: "1px solid " + bdColor, borderTop: "0.1px solid " + bhColor, borderBottom: "0.1px solid " + bhColor};

    var chartData={};

    return (
        <div className={classes.LockdownTimetable} style={{background:self.props.themes.live.dialog.background,
          color:self.props.themes.live.dialog.text}}>
               
        
          {performanceLoading ? (
                <div>
                    <Spinner />
                </div>
        ) : performanceError ? (
          <div style={{height: innerHeight - 172,  background: self.props.isdialog ? self.props.themes.live.dialog.background : self.props.themes.live.dialog.tab_color_active} }>

          <center >  
          <br/>
          <h4>
            {performanceError ? performanceError + "" :
              "Data not Available"}
          </h4>
          </center>
          
          </div>
        ) : (

          <div className={classes.LockdownTimetable} >
                
                <div style={{"width": "90%", margin:"0px", padding:"10px", height:"40px", "float":"left", background: self.props.isdialog ? self.props.themes.live.dialog.background : self.props.themes.live.dialog.tab_color_active}}>
                  <center><h4>
                  {this.state.title ? 
                    this.state.title
                   : null }
                  </h4></center>
                </div>
            <div style={{"width": "10%", margin:"0px", padding:"10px", height:"40px", "float":"left", "textAlign": "right", background: self.props.isdialog ? self.props.themes.live.dialog.background : self.props.themes.live.dialog.tab_color_active}}>
                  <img src="/images/infotext_button.png" width="22" style={{"marginRight":"5px"}}/>
                </div>

<div style={{"clear": "both"}}></div>
            <div className={classes.ChartContainer} >
          <ReactTable
          data={performance}
          columns={[
            {
              Header: "",
              columns: self.hasQty ?
              [
                {
                  Header: "Markets",
                  accessor: "Markets",
                  Cell: props => <span><a href='#market' onClick={()=> {
                    console.log(props);
                    var sym= props.value;
                    sym=sym.substr(0, sym.indexOf(' ')); 
                    /*
                    self.props.initializeHeatmap('','',sym);
                    if (self.props.toggle)
                      self.props.toggle();
                    $(window).scrollTop($("#marketTop").offset().top-111);
                    */
                      self.props.showHtmlDialog3(<Markets load_account_id={''} 
                        load_symbol={sym} 
                        load_link={''}
                        load_portfolio={''} 
                        is_dialog={true}
                        />)


                  }} >{props.value}</a></span>, // Custom cell components!,

                },
                {
                  Header: "Quantity",
                  accessor: "qty",
                  id:"qty",
                  Cell: props => <span style={{color:'black'}} onClick={()=>{ console.log(props); }}><center>{props.value}</center></span>, // Custom cell components!,
                },
                {
                  Header: "Next Trigger",
                  accessor: "Next_Trigger",
                  Cell: props => <span style={{color:props.original.Color}} onClick={()=>{ console.log(props); }}><center>{props.value}</center></span>, // Custom cell components!,
                },
                {
                    Header: "Next Close",
                    accessor: "Next_Close",
                    Cell: props => <span style={{color:props.original.Color}} onClick={()=>{ console.log(props); }}><center>{props.value}</center></span>, // Custom cell components!,
                  },
                ] :
                [
                  {
                    Header: "Markets",
                    accessor: "Markets",
                    Cell: props => <span><a href='#market' onClick={()=> {
                      console.log(props);
                      var sym= props.value;
                      sym=sym.substr(0, sym.indexOf(' ')); 
                      self.props.initializeHeatmap('','',sym);
                      if (self.props.toggle)
                        self.props.toggle();
                      $(window).scrollTop($("#marketTop").offset().top-111);
                    }} >{props.value}</a></span>, // Custom cell components!,
  
                  },
                  {
                    Header: "Next Trigger",
                    accessor: "Next_Trigger",
                    Cell: props => <span style={{color:props.original.Color}} onClick={()=>{ console.log(props); }}><center>{props.value}</center></span>, // Custom cell components!,
                  },
                  {
                      Header: "Next Close",
                      accessor: "Next_Close",
                      Cell: props => <span style={{color:props.original.Color}} onClick={()=>{ console.log(props); }}><center>{props.value}</center></span>, // Custom cell components!,
                    },
                  ]
                ,
            
            },
            
          ]}
          defaultPageSize={performance.length < 13 ? 13 : performance.length}
          minRows={13}

          style={{
            width:"100%",
            height: innerHeight - 230 + adjHeight,
            maxHeight: "100%",
            overflow: performance.length > 13 ? "auto" : "hidden",
            fontSize:"12px",
            fontWeight: 800,
          }}
          className="-striped -highlight"
          showPagination={false}
        />
        </div>
        </div>
        )}
        </div>
    );
  }

}
