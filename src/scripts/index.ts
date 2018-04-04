import { sp } from '@pnp/sp';
import { setupPnp } from './utils/odata';
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Highcharts from 'highcharts';

setupPnp();

sp.web.select('Title').get().then(web => {
  console.log(`Web: '${web.Title}'`);
});


// declare function setPortfolioName(txt:any, lbl:any): any;
// declare function buildstr(txt:any, lbl:any): any;
// declare function buildstrformultiple(txt:any, lbl:any): any;
// declare function getVBUData(txt:any, lbl:any): any;
// declare function getCurrentPeriod(txt:any, lbl:any): any;

var env = "";
var Highcharts = require('highcharts');

if (window.location.href.toLowerCase().indexOf("staging") > -1)
  env = "https://staging.ourvolaris.com";
else
  env = "https://www.ourvolaris.com";

const store = new Vuex.Store({
  state: {
    Quarter: "",
    Year: 0,
    SelectedQuarters: [],
    SelectedYears: [],
    currentlySelectedQuarters: [],
    currentlySelectedYears: [],
    SelectedPortfolio: [],
    SelectedPortfolioData: [],
    PortfolioArray: [],
    metricsData: [],
    originalData: [],
    showData: true,
    ComparisonSelected: false,
    allPortfolios: [],
    currentManagers: [],
    filterSelected: false,
    _loading:true,
    _nodata: false,
    _portfolioManagerData:[],
    _portfoliomanagers:[],
    _comparedata:"vbu"
  },
  getters: {
    CurrentYear: function (state) {
      return state.Year;
    },
    CurrentQuarter: function (state) {
      return state.Quarter;
    },
    CurrentPortfolio: function (state) {
      return state.SelectedPortfolio;
    },
    CurrentPortfolioData: function (state) {
      return state.SelectedPortfolioData;
    },
    getMetrics: function (state) {
      var data = state.metricsData.map(function (item) {
        if (!state.filterSelected) {
          return {
            color: item.color,
            name: setPortfolioName(item.name, item.Label),
            //name: fixPortfolioName(item.name),
            //name: item.name,
            dname: item.name.split("VBU Portfolio")[0],
            rev: item.z,
            x: item.x,
            y: item.y,
            z: item.z,
            count: item.vbu,
            dataLabels: {
              //backgroundColor: item.color,
              color: '#000',
              borderWidth: 2,
              //padding: 5,
              //y: -15
              // x: getColumnValueX(item.PositionX),
              // y: getColumnValueY(item.PositionY)
            }
          }
        }
		else
		{
			if (state._comparedata == "vbu")
			{
				return {
					color: item.color,
					//name: item.name,
					name: setPortfolioName(item.name, item.Label),
					dname: item.name,
					rev: item.z,
					x: item.x,
					y: item.y,
					z: item.z,
					dataLabels: {
					//backgroundColor: item.color,
					color: '#000',
					borderWidth: 2,
					padding: 5
					}
				}
			}
			else
			{
				return {
					color: item.color,
					//name: item.name,
					name: item.name,
					dname: item.name,
					count: item.c,
					rev: item.z,
					x: item.x,
					y: item.y,
					z: item.z,
					dataLabels: {
					//backgroundColor: item.color,
					color: '#000',
					borderWidth: 2,
					padding: 5
					}
				}
			}
        }
      })
      return data;
    },
    getOriginal: function (state) {
      return state.originalData;
    },
    getPortfolioArray: function (state) {
      return state.PortfolioArray;
    },
    getDisplayPeriod: function (state) {
      if (state.SelectedQuarters.length == 1 && state.SelectedYears.length == 1)
        return state.SelectedQuarters[0] + " " + state.SelectedYears[0];
      else if (state.SelectedQuarters.length == 0 && state.SelectedYears.length == 0)
        return state.Quarter + " " + state.Year;
      return "";
    },
    ShouldBeShown: function (state) {
      return state.showData;
    },
    getSelectedQuarters: function (state) {
      return state.SelectedQuarters;
    },
    getSelectedYears: function (state) {
      return state.SelectedYears;
    },
    getISCurrentPeriod: function (state) {
      if (state.SelectedQuarters.length == 1 && state.SelectedYears.length == 1) {
        if (state.SelectedQuarters[0] != state.Quarter || state.SelectedYears[0] != state.Year)
          return false;
        return true;
      }
      return false;
    },
    getComparison: function (state) {
      return state.ComparisonSelected;
    },
    getAllPortfolios: function (state) {
      return state.allPortfolios;
    },
    getCurrentManagers: function (state) {
      return state.currentManagers;
    },
    getReportDataAll: function (state) {
      var data = state.metricsData.map(function (item) {
        return {
          VBU_Name: item.name,
          Organic_Growth: item.y,
          Core_Ratio: item.x,
          Revenue: "$" + item.z + "M"
        }
      });
      data.sort(function (a, b) {
        if (a.VBU_Name > b.VBU_Name)
          return 1;
        if (a.VBU_Name > b.VBU_Name)
          return -1;
        return 0;
      });
      return data;
    },
    getReportDataKeysAll: function (state) {
      var data = [];
      data.push({ key: 'VBU_Name', sortable: true }, { key: 'Organic_Growth', sortable: true }, { key: 'Core_Ratio', sortable: true }, { key: 'Revenue', sortable: true });
      return data;
    },
    getFilterSelected: function (state) {
      return state.filterSelected;
    },
    getLoading: function(state){
        return state._loading;
    },
    getCurrentlySelectedQuarters: function(state){
        return state.currentlySelectedQuarters;
    },
    getCurrentlySelectedYears: function(state){
        return state.currentlySelectedYears;
    },
    getNoData: function(state){
        return state._nodata;
	},
	getPortfolioManagers: function(state){
		return state._portfoliomanagers;
	},
	getComparisonData: function(state){
		return state._comparedata;
	}

  },
  mutations: {
    updateYear: function (state, payload) {
      state.Year = payload;
    },
    updateQuarter: function (state, payload) {
      state.Quarter = payload;
    },
    updatePortfolio: function (state, payload) {
      state.SelectedPortfolio = payload;
    },
    setChartData: function (state, payload) {
      state.metricsData = payload;
    },
    setOriginalData: function (state, payload) {
      state.originalData = payload;
    },
    setPortfolioArrayData: function (state, payload) {
      state.PortfolioArray = payload;
    },
    setSelectedPortfolioData: function (state, payload) {
      state.SelectedPortfolioData = payload;
    },
    // setWorkingArray: function (state, payload) {
    //   state.workingArry = payload;
    // },
    setSelectedQuarters: function (state, payload) {
      state.SelectedQuarters = payload;
    },
    setSelectedYears: function (state, payload) {
      state.SelectedYears = payload;
    },
    setShouldBeShown: function (state, payload) {
      state.showData = payload;
    },
    setComparison: function (state, payload) {
      state.ComparisonSelected = payload;
    },
    setAllPortfolios: function (state, payload) {
      state.allPortfolios = payload;
    },
    setCurrentManagers: function (state, payload) {
      state.currentManagers = payload;
    },
    setFilterSelected: function (state, payload) {
      state.filterSelected = payload;
    },
    setLoading: function(state,payload){
        state._loading = payload;
    },
    setCurrentlySelectedQuarters: function(state, payload){
         state.currentlySelectedQuarters.push(payload);
    },
    setCurrentlySelectedYears: function(state, payload){
         state.currentlySelectedYears.push(payload);
    },
    setNoData: function(state, payload){
        state._nodata = payload;
	},
	setPortfolioManagers: function(state, payload){
		state._portfoliomanagers = payload;
	},
	setComparisonData: function(state, payload){
		state._comparedata = payload;
	}

  },
  actions: {
    newPortfolio: function (context, payload) {
        context.commit("updatePortfolio", payload.parm1);
        var str = buildstr(payload.parm2, payload.parm3)
        var str1 = buildstrformultiple(payload.parm2, payload.parm3);
        context.commit("setSelectedQuarters", payload.parm2.sort());
        context.commit("setSelectedYears", payload.parm3.sort());

        var wrkAry = [];
        var wrk = {};
        var colorAry = [];
        axios
          .get(
            _spPageContextInfo.webServerRelativeUrl +
              "/_api/web/lists/getbytitle('VBURatios')/items?$top=5000&$select=Title,CoreRatio,OrganicGrowth,NetRevenue,VBU_x0020_Label,Portfolio_x0020_Manager,FiscalYear,Quarter&$filter=" +
              str,
            {
              headers: {
                accept: "application/json;odata=verbose"
              }
            }
          )
          .then(function(response) {
            var _data = [];
            axios
              .get(
                _spPageContextInfo.webServerRelativeUrl +
                  '/_api/search/query?querytext=\'Path:"https://www.ourvolaris.com/sites/leaders/lists/vburatios" ' +
                  str1 +
                  "'&selectproperties='Title,FiscalYearOWSCHCS,QuarterOWSCHCS,owstaxIdPortfolio_x0020_Manager'&rowlimit=500",
                {
                  headers: {
                    accept: "application/json;odata=verbose"
                  }
                }
              )
              .then(function(data) {
                data.data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach(
                  function(item) {
                    var dt = {
                      VBU: item.Cells.results[2].Value,
                      Quarter: item.Cells.results[4].Value,
                      Year: item.Cells.results[3].Value,
                      Manager: item.Cells.results[5].Value
                    };
                    _data.push(dt);
                  }
                );

                if (response.data.d.results.length == 0) {
                  context.commit("setNoData", true);
                  context.commit("setChartData", []);
                  context.commit("setOriginalData", []);
                } else {
                  context.commit("setNoData", false);
                  getVBUData(response, _data);
                }
              })
              .then(function() {
                var wrk = [],
                  data = [];
                if (context.state.SelectedPortfolio.length > 0) {
                  context.state.SelectedPortfolio.forEach(function(
                    selected
                  ) {
                    wrk = context.state.originalData.filter(function(
                      item
                    ) {
                      return item.Manager == selected;
                    });
                    Array.prototype.push.apply(data, wrk);
                  });

                  if (context.state.SelectedQuarters.length > 1 || context.state.SelectedYears.length > 1) {
                    //set the colors by quarter
                    data.forEach(function(item) {
                      item.color = colorsbyYear(item.FiscalYear + item.Quarter);
                      var st = colorAry.filter(function(dta) {
                        return dta.Key == item.FiscalYear + item.Quarter;
                      });
                      if (st.length == 0) {
                        var dt = { Color: item.color, Key: item.FiscalYear + item.Quarter };
                        colorAry.push(dt);
                      }
                    });
                  }
                } else data = context.state.originalData;
                context.commit("setChartData", data);
                context.commit("setLoading", false);
              })
              .then(function() {
                //get the portfolio label info to be shown
                var wrk1,
                  dt,
                  data1 = [];
                if (context.state.SelectedQuarters.length > 1 || context.state.SelectedYears.length > 1) {
                  wrk1 = context.state.PortfolioArray.filter(function(
                    item
                  ) {
                    return (
                      item.Manager == context.state.SelectedPortfolio[0]
                    );
                  });
                  colorAry.sort(function(a, b) {
                    if (a.Key < b.Key) return -1;
                    if (a.Key > b.Key) return 1;
                    return 0;
                  });

                  colorAry.forEach(function(item) {
                    dt = { Color: item.Color, Manager: wrk1[0].PortfolioMgr + " " + item.Key.substr(4, 2) + " " + item.Key.substr(0, 4) };
                    data1.push(dt);
                  });
                  context.commit("setComparison", true);
                } else {
                  context.state.SelectedPortfolio.forEach(function(
                    selected
                  ) {
                    wrk1 = context.state.PortfolioArray.filter(function(
                      item
                    ) {
                      return item.Manager == selected;
                    });
                    dt = {
                      Color: wrk1[0].Color,
                      Manager: wrk1[0].PortfolioMgr
                    };
                    data1.push(dt);
                  });
                  context.commit("setComparison", false);
                }
                context.commit("setSelectedPortfolioData", data1);
                context.commit("setShouldBeShown", true);
                context.commit("setLoading", false);
              });
          });
    },
    filterPortfolio: function (context, payload) {
      var wrk = [], data = [];
      if (payload.length > 0) {
        payload.forEach(function (selected) {
          wrk = context.state.originalData.filter(function (item) {
            return item.Manager == selected;
          });
          Array.prototype.push.apply(data, wrk);
        });
        context.commit("setChartData", data);
        //get the portfolio info to be shown
        var wrk1, dt, data1 = [];
        payload.forEach(function (selected) {
          wrk1 = context.state.PortfolioArray.filter(function (item) {
            return item.Manager == selected;
          });
          dt = {
            Color: wrk1[0].Color,
            Manager: wrk1[0].PortfolioMgr
          };
          data1.push(dt);
        });
        context.commit("setSelectedPortfolioData", data1);
        context.commit("setShouldBeShown", true);
        context.commit("setFilterSelected", true);
      }
      else {
        context.commit("setChartData", context.state.originalData);
        context.commit("setSelectedPortfolioData", "");
        context.commit("setShouldBeShown", false);
        context.commit("setFilterSelected", false);
      }
    },
    allPortfolio: function (context) {
        context.commit("setSelectedPortfolioData", "");
        context.commit("updatePortfolio", "");
        context.commit("setSelectedQuarters", "");
        context.commit("setSelectedYears", "");
        context.commit("setComparison", false);
        context.commit("setFilterSelected", false);
        getCurrentPeriod("", "");
    },
    resetSelections: function(context){
        context.state.currentlySelectedQuarters = [];
        context.state.currentlySelectedYears = [];
	},
	getCompareData: function(context, payload){
		var data = [];
		var _rev=0, _cr=0, _og=0;
		if (payload == "portfolio"){
			context.state.SelectedPortfolioData.forEach(function(item){
				var ary = context.state.metricsData.filter(function(dta){
					return item.Color == dta.color;
				})
				ary.forEach(function(cnt){
					_rev += cnt.z;
					_cr += cnt.x;
					_og += cnt.y
				})
				_cr = Math.round(_cr / ary.length);
				_og = Math.round(_og / ary.length);
				var dt ={
					name: item.Manager,
					color: item.Color,
					z: _rev,
					x: _cr,
					y: _og,
					c: ary.length
				}
				data.push(dt);
			})
			_rev = 0;
			_cr = 0;
			_og = 0;
			data.forEach(function(item){
				if (_cr < item.x)
					_cr = item.x;
				if (_og < item.y)
					_og = item.y;
			})

			var mn = {
				name: "",
				color: "#fff",
				z: 10,
				x:_cr,
				y: _og,
				c: 0
			}
			data.push(mn);
			context.commit("setComparisonData", payload);
			context.commit("setChartData",data);
		}
	}
  }
});

var chartlengend = Vue.component("chart-lengend", {
  template:
    '<div id="lengd">\
                <div style="font-weight:bold">Select Senior Portfolio</div>\
				<ul>\
					<li class="liport" v-for="item in lengend" v-if="showPortfolio(item.Color)"  :title="titleText(item.PortfolioMgr)"><input type="checkbox" class="chkbx" :value="item.Manager" v-if="!comparisonSelected" v-model="portfolioAry" /> <span class="box" :style="{ backgroundColor: item.Color, color: item.Color }">DD</span> {{ item.PortfolioMgr }} </li></ul>\
				<b-button size="sm" class="clrcss" @click="clearall" variant="warning" title="clear all selections" v-if="portfolioAry.length > 0 && !comparisonSelected">Clear</b-button>\
				<div>\
                    <hr>\
                    <div style="font-weight:bold">Select Quarter</div>\
                    <div id="period">\
                        <div>\
                            <p>Quarter: </p>\
                            <ul>\
                                <li><input id="Q1" type="checkbox" value="Q1" class="chkbx" v-model="selectedQuarter" :disabled="comparisonSelected" /> <label for="Q1">Q1</label></li>\
                                <li><input id="Q2" type="checkbox" value="Q2" class="chkbx" v-model="selectedQuarter" :disabled="comparisonSelected" /> <label for="Q2">Q2</label></li>\
                                <li><input id="Q3" type="checkbox" value="Q3" class="chkbx" v-model="selectedQuarter" :disabled="comparisonSelected" /> <label for="Q3">Q3</label></li>\
                                <li><input id="Q4" type="checkbox" value="Q4" class="chkbx" v-model="selectedQuarter" :disabled="comparisonSelected" /> <label for="Q4">Q4</label></li>\
                            </ul>\
                        </div>\
                        <div>\
                            <p>Fiscal Year: </p>\
                            <ul>\
                                <li><input id="2016" type="checkbox" value="2016" class="chkbx" v-model="selectedYear" :disabled="comparisonSelected" /> <label for="2016">2016</label></li>\
                                <li><input id="2017" type="checkbox" value="2017" class="chkbx" v-model="selectedYear" :disabled="comparisonSelected" /> <label for="2017">2017</label></li>\
                                <li><input id="2018" type="checkbox" value="2018" class="chkbx" v-model="selectedYear" :disabled="comparisonSelected" /> <label for="2018">2018</label></li>\
                            </ul>\
                        </div>\
                    </div>\
                    <b-button class="btn btn-success" variant="success" v-if="!comparisonSelected" @click="getPortfolio">OK</b-button>\
                    <b-button class="btn btn-warning" variant="warning" v-if="comparisonSelected" @click="allportfolio">Clear</b-button><br/>\
                </div>\
            </div>',
  data: function() {
    return {
      portfolioAry: [],
      selectedQuarter: [],
      selectedYear: [],
      currentSelection: [],
      typeoptions: [
        { text: "VBUs", value: "vbu" },
        { text: "Portfolios", value: "portfolio" }
      ],
      viewtype: "vbu",
      showtype: false,
      vbudata: []
    };
  },
  props: ["quarter", "year"],
  computed: {
    portfolioSelected: function() {
      if (this.portfolioAry.length > 0) return true;
      return false;
    },
    show: function() {
      return store.getters.ShouldBeShown;
    },
    lengend: function() {
      return store.getters.getPortfolioArray;
    },
    comparisonSelected: function() {
      return store.getters.getComparison;
    },
    loading: function() {
      return store.getters.getLoading;
    }
  },
  watch: {
    portfolioAry: function() {
      store.dispatch("filterPortfolio", this.portfolioAry);
      if (this.portfolioAry.length > 1) {
        this.showtype = true;
        if (this.viewtype == "portfolio")
          store.dispatch("getCompareData", "portfolio");
      } else {
        this.viewtype = "vbu";
        this.showtype = false;
      }
    },
    quarter: function() {
      this.selectedQuarter.push(this.quarter);
    },
    year: function() {
      this.selectedYear.push(this.year);
    },
    viewtype: function() {
      store.commit("setComparisonData", this.viewtype);
      if (this.viewtype == "portfolio")
        store.dispatch("getCompareData", "portfolio");
      else store.dispatch("filterPortfolio", this.portfolioAry);
    }
  },
  methods: {
    getPortfolio: function() {
      if (
        (this.portfolioAry.length == 0 && this.selectedQuarter.length > 1) ||
        (this.portfolioAry.length == 0 && this.selectedYear.length > 1)
      )
        alert("You must select 1 portfolio, to do comparison across quarters");
      else if (
        (this.portfolioAry.length > 1 && this.selectedQuarter.length > 1) ||
        (this.portfolioAry.length > 1 && this.selectedYear.length > 1)
      )
        alert("Mulitple portfolios and multiple quarters cannot be selected");
      else {
        if (this.selectedQuarter.length == 0 || this.selectedYear.length == 0)
          alert("You must select a Quarter and Fiscal Year");
        else {
          if (
            showButton(
              this.selectedQuarter,
              store.getters.getCurrentlySelectedQuarters
            ) ||
            showButton(
              this.selectedYear,
              store.getters.getCurrentlySelectedYears
            )
          ) {
            store.commit("setLoading", true);
            store.dispatch("resetSelections");
            this.selectedQuarter.sort();
            this.selectedQuarter.forEach(function(item) {
              store.commit("setCurrentlySelectedQuarters", item);
            });
            this.selectedYear.sort();
            this.selectedYear.forEach(function(item) {
              store.commit("setCurrentlySelectedYears", item);
            });
            store.dispatch("newPortfolio", {
              parm1: this.portfolioAry,
              parm2: this.selectedQuarter,
              parm3: this.selectedYear
            });
            this.viewtype = "vbu";
          }
        }
      }
    },
    showPortfolio: function(color) {
      if (store.getters.getComparison == false) return true;
      else {
        if (color == this.portfolioAry[0]) return true;
      }
      return false;
    },
    allportfolio: function() {
      store.commit("setLoading", true);
      store.commit("setChartData", []);
      store.commit("setOriginalData", []);
      this.currentSelection = [];
      this.portfolioAry = [];
      this.selectedQuarter = [];
      this.selectedQuarter.push(this.quarter);
      this.selectedYear = [];
      this.selectedYear.push(this.year);
      store.dispatch("allPortfolio", this.portfolioAry);
    },
    titleText: function(name) {
      return "Click to view chart for " + name;
    },
    addSelectedPeriod: function() {
      if (this.portfolioAry.length > 1 && this.currentSelection.length == 1) {
        alert(
          "Only one period can be selected when mulitple portfolios have been selected"
        );
        return false;
      }
      if (this.portfolioAry.length == 0 && this.currentSelection.length == 1) {
        alert(
          "You cannot select multiple periods for all portfolios. You must select one portfolio"
        );
        return false;
      }
      var dt = {
        ID: this.currentSelection.length + 1,
        Quarter: this.selectedQuarter,
        Year: this.selectedYear,
        Key: this.selectedYear + this.selectedQuarter
      };
      this.currentSelection.push(dt);
    },
    removeSelection: function(id) {
      var wrk = this.currentSelection.filter(function(item) {
        return item.ID != id;
      });
      this.currentSelection = wrk;
    },
    clearall: function() {
      this.portfolioAry = [];
      this.viewtype = "vbu";
      this.showtype = false;
    },
    getValue: function(val1, val2) {
      return val1 + "|" + val2;
    }
  },
  updated: function() {}
});

var _chart = Vue.component("vbu-chart", {
  template:
    '<div>\
                <h2>{{chartTitle}}</h2>\
				<ul class="ulSelected">\
					<li v-for="item in selectedPortfolio"><span class="box" :style="{ backgroundColor: item.Color, color: item.Color }">DD</span> {{ item.Manager }} </li>\
				</ul>\
                <b-button class="btnprint" variant="primary" size="sm" @click="printchart">Rules</b-button>\
				<transition name="load">\
					<div v-show="loading" class="dvloading">\
						<img src="../siteassets/bubble/please_wait.gif" />\
					</div>\
				</transition>\
                <div id="container" v-show="!nodata"></div>\
				<div v-show="nodata"><h2>No Data Found</h2></div>\
                <b-modal ref="rulesmdl" size="lg" hide-footer centered title="Interactive Bubble Chart" title-tag="h1">\
                    <p><strong>Data available</strong></p>\
                    The data goes back to Q4, 2016. Previous quarters are not available. Data is based on quarterly reports used for metrics and the bubble chart. The data included:\
                    <ul>\
                        <li>Core Ratio</li>\
                        <li>Organic Growth</li>\
                        <li>Net Revenue</li>\
                    </ul>\
                    <p><strong>Rules and notes for display</strong></p>\
                    Because this is a pilot project, there are some limitations on the views:\
                    <ol>\
                        <li>The main (home) view does NOT show revenue as relative bubble size. However, the bubble size is keyed to revenue in other views.\
                        </li>\
                        <li>Data labels may overlap. Because this is a pilot project, there are some basic display features that are minimal. However, if you hover over a bubble, you can see each VBU\'s metrics.\
                        </li>\
                        <li>If you want to view multiple quarters, you must select <strong>one portfolio only</strong>.\
                        </li>\
                        <li>If you want to view multiple portfolios, you must select <strong>one quarter only</strong>.\
                        </li>\
                        <li>For any chart, you can view data only by selecting <strong>Show Data</strong>. This chart is also printable to file.\
                        </li>\
                        <li>To switch from one view to another, first <strong>Clear</strong> the previous view filters.\
                        </li>\
                    </ol>\
                    <h2 style="text-align: left;">Quickstart for popular views/tasks</h2>\
                    <p><strong>View one or more quarters for a portfolio:</strong></p>\
                    <ol>\
                        <li>Select a portfolio from the <strong>Senior Portfolio</strong> list.</li>\
                        <li>Select one or more quarters from the <strong>Select Quarter</strong> list.</li>\
                        <li>Click <strong>OK</strong>.</li>\
                        <li>To switch to another view, select <strong>Clear</strong>.</li>\
                    </ol>\
                    <p><strong>View one or more portfolios for a specific quarter:</strong></p>\
                    <ol>\
                        <li>Select one or more portfolio from the <strong>Senior Portfolio</strong> list.</li>\
                        <li>Select one quarter from the <strong>Select Quarter</strong> list.</li>\
                        <li>Click <strong>OK</strong>.</li>\
                        <li>To switch to another view, select <strong>Clear</strong>.</li>\
                    </ol>\
                    <p><strong>Show data for a view:</strong></p>\
                    <ol>\
                        <li>Create a view by selecting an appropriate combination of portfolio/quarter.</li>\
                        <li>Select <strong>Show Data</strong></li>\
                        <li>If multiple quarters were selected for the view, you can sort the data by VBU or by quarter.</li>\
                        <li>To view the data in a chart, select <strong>Show data in chart</strong>.</li>\
                    </ol>\
                    <p>Feedback or suggestions? Email <a href="mailto:lrc@volarisgroup.com">lrc@volarisgroup.com</a></p>\
				</b-modal>\
			</div>',
  data: function() {
    return {
      pcolor: "",
      highchartsOptions: {},
      scatterOptions: {},
      prevselectedQuarter: "",
      prevselectedYear: 0,
      chartTitle: "Volaris Business Unit Performance",
      chart: undefined,
      togglevbu: "junior"
    };
  },
  computed: {
    chartAry: function() {
      return store.getters.getMetrics;
    },
    selectedPortfolio: function() {
      return store.getters.CurrentPortfolioData;
    },
    nodata: function() {
      return store.getters.getNoData;
    },
    loading: function() {
      return store.getters.getLoading;
    }
  },
  methods: {
    printchart: function() {
      this.$refs.rulesmdl.show();
    }
  },
  watch: {
    chartAry: function() {
      this.chartTitle =
        "Volaris Business Unit Performance  " + store.getters.getDisplayPeriod;
      if (store.getters.getFilterSelected) {
        this.chart.destroy();
        if (store.getters.getComparisonData == "vbu")
          this.chart = Highcharts.chart(this.highchartsOptions);
        else this.chart = Highcharts.chart(this.PorfolioOptions);
      } else {
        this.chart.destroy();
        this.chart = Highcharts.chart(this.scatterOptions);
      }
      this.chart.series[0].setData(store.getters.getMetrics, true);
      this.chart.redraw();
    }
  },
  created: function() {
    (this.highchartsOptions = {
      chart: {
        type: "bubble",
        plotBorderWidth: 1,
        renderTo: "container"
      },

      credits: {
        enabled: false
      },

      lengend: {
        enabled: false,
        labelFormat: "",
        title: [
          {
            text: ""
          }
        ]
      },

      title: {
        text: null
      },

      xAxis: {
        gridLineWidth: 1,
        title: {
          text: "CORE RATIO"
        },
        labels: {
          format: "{value}%"
        },
        plotLines: [
          {
            color: "blue",
            width: 2,
            value: 40
          }
        ]
      },

      yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
          text: "ORGANIC GROWTH"
        },
        labels: {
          format: "{value}%"
        },
        plotLines: [
          {
            color: "blue",
            width: 2,
            value: 10
          }
        ]
      },

      tooltip: {
        useHTML: true,
        headerFormat: "<table>",
        pointFormat:
          '<tr><th colspan="2" style="color: {point.color}; font-weight:bold;"><h6>{point.dname}</h6></th></tr>' +
          "<tr><th>Core Ratio:</th><td>{point.x}%</td></tr>" +
          "<tr><th>Organic Growth:</th><td>{point.y}%</td></tr>" +
          "<tr><th>Total Revenue:</th><td>${point.rev}M</td></tr>",
        footerFormat: "</table>",
        followPointer: false
      },

      plotOptions: {
        series: {
          dataLabels: {
            shape: "callout",
            enabled: true,
            format: "{point.name}",
            color: "#000",
            allowOverlap: true,
            //verticalAlign: "top",
            style: [
              {
                textOutline: "none"
              }
            ]
          },
          cursor: "pointer",
          events: {
            click: function() {
              //alert(event.point.name + ' click');
            }
          }
        }
      },

      series: [
        {
          data: "",
          name: "",
          events: {
            legendItemClick: function() {
              return false;
            }
          }
        }
      ]
    }),
      (this.scatterOptions = {
        chart: {
          type: "scatter",
          plotBorderWidth: 1,
          renderTo: "container"
        },

        credits: {
          enabled: false
        },

        lengend: {
          enabled: false,
          labelFormat: "",
          title: [
            {
              text: ""
            }
          ]
        },

        title: {
          text: null
        },

        xAxis: {
          gridLineWidth: 1,
          title: {
            text: "CORE RATIO"
          },
          labels: {
            format: "{value}%"
          },
          plotLines: [
            {
              color: "blue",
              width: 2,
              value: 40
            }
          ]
        },

        yAxis: {
          startOnTick: false,
          endOnTick: false,
          title: {
            text: "ORGANIC GROWTH"
          },
          labels: {
            format: "{value}%"
          },
          plotLines: [
            {
              color: "blue",
              width: 2,
              value: 10
            }
          ]
        },

        tooltip: {
          useHTML: true,
          headerFormat: "<table>",
          pointFormat:
            '<tr><th colspan="2" style="color: {point.color};"><h6>{point.dname}</h6></th></tr>' +
            "<tr><th>Core Ratio:</th><td>{point.x}%</td></tr>" +
            "<tr><th>Organic Growth:</th><td>{point.y}%</td></tr>" +
            //'<tr><th>VBU\'s:</th><td>{point.count}</td></tr>' +
            "<tr><th>Revenue:</th><td>${point.rev}M</td></tr>",
          //'<tr><th>Avg Rev:</th><td>${point.z}M</td></tr>',
          footerFormat: "</table>",
          hideDelay: 600,
          followPointer: false
        },

        plotOptions: {
          series: {
            dataLabels: {
              shape: "callout",
              align: "center",
              enabled: true,
              format: "{point.name}",
              color: "#000",
              allowOverlap: true,
              style: [
                {
                  textOutline: "none"
                }
              ],
              y: 20
            },
            marker: {
              radius: 20
            },
            cursor: "pointer",
            events: {
              click: function() {
                //alert(event.point.name + ' click');
              }
            }
          }
        },

        series: [
          {
            data: "",
            name: " ",
            events: {
              legendItemClick: function() {
                return false;
              }
            }
          }
        ]
      }),
      (this.PorfolioOptions = {
        chart: {
          type: "bubble",
          plotBorderWidth: 1,
          renderTo: "container"
        },

        credits: {
          enabled: false
        },

        lengend: {
          enabled: false,
          labelFormat: "",
          title: [
            {
              text: ""
            }
          ]
        },

        title: {
          text: null
        },

        xAxis: {
          gridLineWidth: 1,
          title: {
            text: "CORE RATIO"
          },
          labels: {
            format: "{value}%"
          },
          plotLines: [
            {
              color: "blue",
              width: 2,
              value: 40
            }
          ]
        },

        yAxis: {
          startOnTick: false,
          endOnTick: false,
          title: {
            text: "ORGANIC GROWTH"
          },
          labels: {
            format: "{value}%"
          },
          plotLines: [
            {
              color: "blue",
              width: 2,
              value: 10
            }
          ]
        },

        tooltip: {
          useHTML: true,
          headerFormat: "<table>",
          pointFormat:
            '<tr><th colspan="2" style="color: {point.color}; font-weight:bold;"><h6>{point.dname}</h6></th></tr>' +
            "<tr><th>Number of VBUs:</th><td>{point.count}</td></tr>" +
            "<tr><th>Avg. Core Ratio:</th><td>{point.x}%</td></tr>" +
            "<tr><th>Avg. Organic Growth:</th><td>{point.y}%</td></tr>" +
            "<tr><th>Total Revenue:</th><td>${point.rev}M</td></tr>",
          footerFormat: "</table>",
          followPointer: false
        },

        plotOptions: {
          series: {
            dataLabels: {
              shape: "callout",
              enabled: true,
              format: "{point.name}",
              color: "#000",
              allowOverlap: true,
              //verticalAlign: "top",
              style: [
                {
                  textOutline: "none"
                }
              ]
            },
            cursor: "pointer",
            events: {
              click: function() {
                //alert(event.point.name + ' click');
              }
            }
          }
        },

        series: [
          {
            data: "",
            name: "",
            events: {
              legendItemClick: function() {
                return false;
              }
            }
          }
        ]
      });
  },
  mounted: function() {
    this.chart = Highcharts.chart(this.scatterOptions);
  }
});

Vue.component("vbu-data", {
  template:
    '<div class="showButton">\
                <button type="button" class="btn btn-primary" @click.prevent="showData">Show Data</button>\
              </div>\
            ',
  data: function() {
    return {
      aWin: null
    };
  },
  methods: {
    showData: function() {
      if (this.aWin != null) this.aWin.close();
      sessionStorage.removeItem("LRCData");
      sessionStorage.setItem(
        "LRCData",
        JSON.stringify(store.getters.getMetrics)
      );
      var data = {
        Year: store.getters.CurrentYear,
        Quarter: store.getters.CurrentQuarter,
        SelectedPortfolio: store.getters.CurrentPortfolioData,
        SelectedYears: store.getters.getSelectedYears,
        SelectedQuarters: store.getters.getSelectedQuarters,
        Comparison: store.getters.getComparison,
        CompareType: store.getters.getComparisonData
      };
      sessionStorage.removeItem("LRCDataDetails");
      sessionStorage.setItem("LRCDataDetails", JSON.stringify(data));
      this.aWin = window.open(
        "../sitepages/bubble chart data.aspx",
        "ChartData",
        "resizable=1,height=800,width=1000"
      );
      return false;
    }
  }
});

var app = new Vue({
  el: "#content",
  data: {
    vbuData: [],
    lengendData: [],
    appquarter: "Q4",
    appyear: "2017"
  },
  beforeCreate: function() {
    getCurrentPeriod("", "");
  }
});

function colorsbyYear(data) {
  var clr;
  switch (data) {
    case "2016Q4":
      clr = "#ff9068";
      break;
    case "2017Q1":
      clr = "#E57373";
      break;
    case "2017Q2":
      clr = "#9575CD";
      break;
    case "2017Q3":
      clr = "#4FC3F7";
      break;
    case "2017Q4":
      clr = "#81C784";
      break;
    case "2018Q1":
      clr = "#ffeb3b";
      break;
    case "2018Q2":
      clr = "#ffc400";
      break;
    case "2018Q3":
      clr = "#795548";
      break;
    case "2018Q4":
      clr = "#ff6e40";
      break;
  }
  return clr;
}

function getCurrentPeriod(qr, yr) {
  var restAry = [];
  var mgr = [],
    manager = [],
    PortfolioArry = [],
    wrkClr = "";
  var index = 0;
  var url =
    _spPageContextInfo.webServerRelativeUrl +
    "/_api/web/lists/getbytitle('VBURatios')/items?$top=1&$orderby=FiscalYear desc,Quarter desc";
  if (qr == "" && yr == "") {
    axios
      .get(url, {
        headers: { accept: "application/json;odata=verbose" }
      })
      .then(function(response) {
        store.commit("updateYear", response.data.d.results[0].FiscalYear);
        store.commit("updateQuarter", response.data.d.results[0].Quarter);
        //app.appquarter = response.data.d.results[0].Quarter;
        //app.appyear = response.data.d.results[0].FiscalYear;
        store.dispatch("resetSelections");
        store.commit(
          "setCurrentlySelectedQuarters",
          response.data.d.results[0].Quarter
        );
        store.commit(
          "setCurrentlySelectedYears",
          response.data.d.results[0].FiscalYear
        );
      })
      .then(function(data) {
        var wrkAry = [];
        axios
          .get(
            _spPageContextInfo.webServerRelativeUrl +
              "/_api/web/lists/getbytitle('VBURatios')/items?$top=5000&$select=Title,CoreRatio,OrganicGrowth,NetRevenue,VBU_x0020_Label,Portfolio_x0020_Manager,FiscalYear,Quarter&$filter=FiscalYear eq " +
              store.getters.CurrentYear +
              " and Quarter eq '" +
              store.getters.CurrentQuarter +
              "'",
            {
              headers: {
                accept: "application/json;odata=verbose"
              }
            }
          )
          .then(function(response) {
            var _data = [];
            store.commit("setLoading", false);
            axios
              .get(
                _spPageContextInfo.webServerRelativeUrl +
                  '/_api/search/query?querytext=\'Path:"https://www.ourvolaris.com/sites/leaders/lists/vburatios"QuarterOWSCHCS:' +
                  store.getters.CurrentQuarter +
                  " FiscalYearOWSCHCS:" +
                  store.getters.CurrentYear +
                  "'&selectproperties='Title,FiscalYearOWSCHCS,QuarterOWSCHCS,owstaxIdPortfolio_x0020_Manager'&rowlimit=500",
                {
                  headers: {
                    accept: "application/json;odata=verbose"
                  }
                }
              )
              .then(function(data) {
                data.data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results.forEach(
                  function(item) {
                    var dt = {
                      VBU: item.Cells.results[2].Value,
                      Quarter: item.Cells.results[4].Value,
                      Year: item.Cells.results[3].Value,
                      Manager: item.Cells.results[5].Value
                    };
                    _data.push(dt);
                  }
                );
                getVBUData(response, _data);
                store.commit("setPortfolioManagers", _data);
              });
          });
      });
  }
}

function getLengendData(ary) {
  //app.lengendData = [];
  var prf = "";
  var wrk = {};
  var arry = [];
  ary.forEach(function(x, item) {
    wrk = {
      Color: item.Color,
      PortfolioMgr: item.ShortName,
      Manager: item.Name
    };
    //app.lengendData.push(wrk);
    arry.push(wrk);
  });
  store.commit("setPortfolioArrayData", arry);
}

function getRatio(vl) {
  if (vl < -10) return -10;
  if (vl > 100) return 100;
  return vl;
}

function getSize(vl2, vl3) {
  var num = vl2 + vl3;
  if (num < -10) return -10;
  if (num > 100) return 100;
  return num;
}

function getOrganic(vl) {
  if (vl > 30) return 30;
  if (vl < -30) return -30;
  return vl;
}

function getTaxonomyValue(obj, fieldName) {
  // Iterate over the fields in the row of data
  for (var field in obj) {
    // If it's the field we're interested in....
    if (obj.hasOwnProperty(field) && field === fieldName) {
      if (obj[field] !== null) {
        // ... get the WssId from the field ...
        var thisId = obj[field].WssId;
        // ... and loop through the TaxCatchAll data to find the matching Term
        for (var i = 0; i < obj.TaxCatchAll.results.length; i++) {
          if (obj.TaxCatchAll.results[i].ID === thisId) {
            // Augment the fieldName object with the Term value
            obj[field].Term = obj.TaxCatchAll.results[i].Term;
            return obj[field].Term;
          }
        }
      }
    }
  }
  // No luck, so return null
  return null;
}

function getPortfolioManagerName(Title, qrt, yer, arry) {
  var dt = arry.filter(function(item) {
    return item.VBU == Title && item.Quarter == qrt && item.Year == yer;
  });
  if (dt.length > 0) return dt[0].Manager;
  return null;
}

function getColumnValueX(vl) {
  if (vl == null) return 50;
  return vl;
}

function getColumnValueY(vl) {
  if (vl == null) return 0;
  return vl;
}

function customOnDialogClose(result, target) {}

function buildstr(quarter, year) {
  var str = "";
  year.forEach(function(item) {
    quarter.forEach(function(qrt) {
      str += "(FiscalYear eq " + item + " and Quarter eq '" + qrt + "') or ";
    });
  });
  return str.substr(0, str.lastIndexOf(" or "));
}

function buildstrformultiple(quarter, year) {
  var str = "";
  year.forEach(function(item) {
    quarter.forEach(function(qrt) {
      str += "(FiscalYearOWSCHCS:" + item + " QuarterOWSCHCS:" + qrt + ") OR ";
    });
  });
  return str.substr(0, str.lastIndexOf(" OR "));
}

function getRevenue(data) {
  var num = Math.round(data / 1000000);
  return num;
}

function setPortfolioName(txt, lbl) {
  var str = "";
  if (lbl == null) {
    if (txt.toLowerCase().indexOf("portfolio") == -1) {
      if (txt.indexOf("-") > -1) str = txt.replace(/-/g, "");
      else str = txt;

      if (str.indexOf(" ") > -1) {
        var st = "";
        var ry = str.split(" ");
        ry.forEach(function(item) {
          st += item.trim() + "<br/>";
        });
        return "<div style='text-align: center;'>" + st + "</div>";
      } else return str;
    }
    return txt;
  } else return lbl;
}

function fixPortfolioName(txt) {
  var str = "";
  txt = txt.replace("VBU Portfolio", "");
  return txt.split(" ")[0] + "<br/>" + txt.split(" ")[1];
}

function getPortfolioColor(arry, prt) {
  var data = arry.filter(function(item) {
    return item.Manager == prt;
  });
  if (data.length > 0) return data[0].Color;
  return "";
}

function IsMainPortfolio(arry, prt) {
  var data = arry.filter(function(item) {
    return item.Manager == prt;
  });
  if (data.length > 0) return true;
  return false;
}

function getMgrColor(vl) {
  var clr = "";
  switch (vl) {
    case "Jesper Ulsted":
      clr = "#237E7E";
      break;
    case "Rick Bacchus":
      clr = "#EB4A2A";
      break;
    case "Mike Dufton":
      clr = "#B2CF88";
      break;
    case "Jim Baker":
      clr = "#67AEC3";
      break;
    case "John Hines":
      clr = "#CD7F32";
      break;
    case "Peter Schneck":
      clr = "#f6ce1e";
      break;
    case "David Nyland":
      clr = "#b429d6";
      break;
    default:
      clr = "#000";
      break;
  }
  return clr;
}

function getNewColor(arry, prt) {
  var data = arry.filter(function(item) {
    return item.Name == prt;
  });
  if (data.length > 0) return data[0].Color;
  return "#000";
}

function getVBUData(response, arry) {
  var restAry = [],
    wrkAry = [];
  if (response.data.d.results.length > 0) {
    response.data.d.results.forEach(function(item) {
      if (
        item.Title != null &&
        item.Title.toLowerCase().indexOf("portfolio") == -1
      ) {
        if (item.Portfolio_x0020_Manager != null) {
          //var nm = getTaxonomyValue(item, "Portfolio_x0020_Manager");
          var nm = getPortfolioManagerName(
            item.Title,
            item.Quarter,
            item.FiscalYear,
            arry
          );
          var lc = restAry.filter(function(dta) {
            return dta.Name == nm;
          });
          if (lc.length == 0) {
            var mt = {
              Name: nm,
              Color: "",
              ShortName: ""
            };
            restAry.push(mt);
          }
        }
      }
    });

    restAry.forEach(function(item, idx) {
      item.Color = getMgrColor(item.Name);
      item.ShortName = item.Name.split(" ")[1] + " Portfolio";
    });
    store.commit("setCurrentManagers", restAry);

    response.data.d.results.forEach(function(item) {
      if (
        item.Title != null &&
        item.Title.toLowerCase().indexOf("portfolio") == -1
      ) {
        if (item.Portfolio_x0020_Manager != null) {
          var wrk = { x: getRatio(item.CoreRatio), y: getOrganic(item.OrganicGrowth), z: getRevenue(item.NetRevenue), FiscalYear: item.FiscalYear, Quarter: item.Quarter, name: item.Title, Label: item.VBU_x0020_Label, //   color: getNewColor(restAry, getTaxonomyValue(item, "Portfolio_x0020_Manager")),
            //   Manager: getTaxonomyValue(item, "Portfolio_x0020_Manager"),
            color: getNewColor(restAry, getPortfolioManagerName(item.Title, item.Quarter, item.FiscalYear, arry)), Manager: getPortfolioManagerName(item.Title, item.Quarter, item.FiscalYear, arry) };
            //PositionX: item.XValue,
            //PositionY: item.YValue
            //color: getColor(item.Title)
          wrkAry.push(wrk);
        }
      }
    });
  }
  store.commit("setChartData", wrkAry);
  store.commit("setOriginalData", wrkAry);
  getLengendData(restAry);
}

function showButton(ary1, ary2) {
  if (ary1.length != ary2.length) return true;
  else {
    if (ary1.length == 1) {
      if (ary1[0] != ary2[0]) return true;
    }
  }
  return false;
}
