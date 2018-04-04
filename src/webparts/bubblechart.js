var env = "";

if (window.location.href.toLowerCase().indexOf("staging") > -1)
  env = "https://staging.ourvolaris.com";
else env = "https://www.ourvolaris.com";

var store = new Vuex.Store({
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
    _loading: true,
    _nodata: false,
    _portfolioManagerData: [],
    _portfoliomanagers: [],
    _comparedata: "vbu"
  },
  getters: {
    CurrentYear: function(state) {
      return state.Year;
    },
    CurrentQuarter: function(state) {
      return state.Quarter;
    },
    CurrentPortfolio: function(state) {
      return state.SelectedPortfolio;
    },
    CurrentPortfolioData: function(state) {
      return state.SelectedPortfolioData;
    },
    getMetrics: function(state) {
      var data = state.metricsData.map(function(item) {
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
              color: "#000",
              borderWidth: 2
              //padding: 5,
              //y: -15
              // x: getColumnValueX(item.PositionX),
              // y: getColumnValueY(item.PositionY)
            }
          };
        } else {
          if (state._comparedata == "vbu") {
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
                color: "#000",
                borderWidth: 2,
                padding: 5
              }
            };
          } else {
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
                color: "#000",
                borderWidth: 2,
                padding: 5
              }
            };
          }
        }
      });
      return data;
    },
    getOriginal: function(state) {
      return state.originalData;
    },
    getPortfolioArray: function(state) {
      return state.PortfolioArray;
    },
    getDisplayPeriod: function(state) {
      if (state.SelectedQuarters.length == 1 && state.SelectedYears.length == 1)
        return state.SelectedQuarters[0] + " " + state.SelectedYears[0];
      else if (
        state.SelectedQuarters.length == 0 &&
        state.SelectedYears.length == 0
      )
        return state.Quarter + " " + state.Year;
      return "";
    },
    ShouldBeShown: function(state) {
      return state.showData;
    },
    getSelectedQuarters: function(state) {
      return state.SelectedQuarters;
    },
    getSelectedYears: function(state) {
      return state.SelectedYears;
    },
    getISCurrentPeriod: function(state) {
      if (
        state.SelectedQuarters.length == 1 &&
        state.SelectedYears.length == 1
      ) {
        if (
          state.SelectedQuarters[0] != state.Quarter ||
          state.SelectedYears[0] != state.Year
        )
          return false;
        return true;
      }
      return false;
    },
    getComparison: function(state) {
      return state.ComparisonSelected;
    },
    getAllPortfolios: function(state) {
      return state.allportfolios;
    },
    getCurrentManagers: function(state) {
      return state.currentManagers;
    },
    getReportDataAll: function(state) {
      var data = [];
      var data = state.metricsData.map(function(item) {
        return {
          VBU_Name: item.name,
          Organic_Growth: item.y,
          Core_Ratio: item.x,
          Revenue: "$" + item.z + "M"
        };
      });
      data.sort(function(a, b) {
        return a.VBU_Name > b.VBU_Name;
      });
      return data;
    },
    getReportDataKeysAll: function(state) {
      var data = [];
      data.push(
        { key: "VBU_Name", sortable: true },
        { key: "Organic_Growth", sortable: true },
        { key: "Core_Ratio", sortable: true },
        { key: "Revenue", sortable: true }
      );
      return data;
    },
    getFilterSelected: function(state) {
      return state.filterSelected;
    },
    getLoading: function(state) {
      return state._loading;
    },
    getCurrentlySelectedQuarters: function(state) {
      return state.currentlySelectedQuarters;
    },
    getCurrentlySelectedYears: function(state) {
      return state.currentlySelectedYears;
    },
    getNoData: function(state) {
      return state._nodata;
    },
    getPortfolioManagers: function(state) {
      return state._portfoliomanagers;
    },
    getComparisonData: function(state) {
      return state._comparedata;
    }
  },
  mutations: {
    updateYear: function(state, payload) {
      state.Year = payload;
    },
    updateQuarter: function(state, payload) {
      state.Quarter = payload;
    },
    updatePortfolio: function(state, payload) {
      state.SelectedPortfolio = payload;
    },
    setChartData: function(state, payload) {
      state.metricsData = payload;
    },
    setOriginalData: function(state, payload) {
      state.originalData = payload;
    },
    setPortfolioArrayData: function(state, payload) {
      state.PortfolioArray = payload;
    },
    setSelectedPortfolioData: function(state, payload) {
      state.SelectedPortfolioData = payload;
    },
    setWorkingArray: function(state, payload) {
      state.workingArry = payload;
    },
    setSelectedQuarters: function(state, payload) {
      state.SelectedQuarters = payload;
    },
    setSelectedYears: function(state, payload) {
      state.SelectedYears = payload;
    },
    setShouldBeShown: function(state, payload) {
      state.showData = payload;
    },
    setComparison: function(state, payload) {
      state.ComparisonSelected = payload;
    },
    setAllPortfolios: function(state, payload) {
      state.allPortfolios = payload;
    },
    setCurrentManagers: function(state, payload) {
      state.currentManagers = payload;
    },
    setFilterSelected: function(state, payload) {
      state.filterSelected = payload;
    },
    setLoading: function(state, payload) {
      state._loading = payload;
    },
    setCurrentlySelectedQuarters: function(state, payload) {
      state.currentlySelectedQuarters.push(payload);
    },
    setCurrentlySelectedYears: function(state, payload) {
      state.currentlySelectedYears.push(payload);
    },
    setNoData: function(state, payload) {
      state._nodata = payload;
    },
    setPortfolioManagers: function(state, payload) {
      state._portfoliomanagers = payload;
    },
    setComparisonData: function(state, payload) {
      state._comparedata = payload;
    }
  },
  actions: {
    newPortfolio: function(context, payload) {
      context.commit("updatePortfolio", payload.parm1);
      var str = buildstr(payload.parm2, payload.parm3);
      var str1 = buildstrformultiple(payload.parm2, payload.parm3);
      context.commit("setSelectedQuarters", payload.parm2.sort());
      context.commit("setSelectedYears", payload.parm3.sort());

      var wrkAry = [];
      var wrk = {};
      var colorAry = [];
      axios
        .get(
          _spPageContextInfo.webServerRelativeUrl +
            "/_api/web/lists/getbytitle('VBURatios')/items?$top=5000&$select=Title,CoreRatio,OrganicGrowth,NetRevenue,VBULabel,LRCPortFolioManager,FiscalYear,Quarter&$filter=" +
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
                "'&selectproperties='Title,FiscalYearOWSCHCS,QuarterOWSCHCS,owstaxIdLRCPortFolioManager'&rowlimit=500",
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
                context.state.SelectedPortfolio.forEach(function(selected) {
                  wrk = context.state.originalData.filter(function(item) {
                    return item.Manager == selected;
                  });
                  Array.prototype.push.apply(data, wrk);
                });

                if (
                  context.state.SelectedQuarters.length > 1 ||
                  context.state.SelectedYears.length > 1
                ) {
                  //set the colors by quarter
                  data.forEach(function(item) {
                    item.color = colorsbyYear(item.FiscalYear + item.Quarter);
                    var st = colorAry.filter(function(dta) {
                      return dta.Key == item.FiscalYear + item.Quarter;
                    });
                    if (st.length == 0) {
                      var dt = {
                        Color: item.color,
                        Key: item.FiscalYear + item.Quarter
                      };
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
              if (
                context.state.SelectedQuarters.length > 1 ||
                context.state.SelectedYears.length > 1
              ) {
                wrk1 = context.state.PortfolioArray.filter(function(item) {
                  return item.Manager == context.state.SelectedPortfolio[0];
                });
                colorAry.sort(function(a, b) {
                  if (a.Key < b.Key) return -1;
                  if (a.Key > b.Key) return 1;
                  return 0;
                });

                colorAry.forEach(function(item) {
                  dt = {
                    Color: item.Color,
                    Manager:
                      wrk1[0].PortfolioMgr +
                      " " +
                      item.Key.substr(4, 2) +
                      " " +
                      item.Key.substr(0, 4)
                  };
                  data1.push(dt);
                });
                context.commit("setComparison", true);
              } else {
                context.state.SelectedPortfolio.forEach(function(selected) {
                  wrk1 = context.state.PortfolioArray.filter(function(item) {
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
    filterPortfolio: function(context, payload) {
      var wrk = [],
        data = [];
      if (payload.length > 0) {
        payload.forEach(function(selected) {
          wrk = context.state.originalData.filter(function(item) {
            return item.Manager == selected;
          });
          Array.prototype.push.apply(data, wrk);
        });
        context.commit("setChartData", data);
        //get the portfolio info to be shown
        var wrk1,
          dt,
          data1 = [];
        payload.forEach(function(selected) {
          wrk1 = context.state.PortfolioArray.filter(function(item) {
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
      } else {
        context.commit("setChartData", context.state.originalData);
        context.commit("setSelectedPortfolioData", "");
        context.commit("setShouldBeShown", false);
        context.commit("setFilterSelected", false);
      }
    },
    allPortfolio: function(context) {
      context.commit("setSelectedPortfolioData", "");
      context.commit("updatePortfolio", "");
      context.commit("setSelectedQuarters", "");
      context.commit("setSelectedYears", "");
      context.commit("setComparison", false);
      context.commit("setFilterSelected", false);
      getCurrentPeriod("", "");
    },
    resetSelections: function(context) {
      context.state.currentlySelectedQuarters = [];
      context.state.currentlySelectedYears = [];
    },
    getCompareData: function(context, payload) {
      var data = [];
      var _rev = 0,
        _cr = 0,
        _og = 0;
      if (payload == "portfolio") {
        context.state.SelectedPortfolioData.forEach(function(item) {
          var ary = context.state.metricsData.filter(function(dta) {
            return item.Color == dta.color;
          });
          ary.forEach(function(cnt) {
            _rev += cnt.z;
            _cr += cnt.x;
            _og += cnt.y;
          });
          _cr = Math.round(_cr / ary.length);
          _og = Math.round(_og / ary.length);
          var dt = {
            name: item.Manager,
            color: item.Color,
            z: _rev,
            x: _cr,
            y: _og,
            c: ary.length
          };
          data.push(dt);
        });
        _rev = 0;
        _cr = 0;
        _og = 0;
        data.forEach(function(item) {
          if (_cr < item.x) _cr = item.x;
          if (_og < item.y) _og = item.y;
        });

        var mn = {
          name: "",
          color: "#fff",
          z: 10,
          x: _cr,
          y: _og,
          c: 0
        };
        data.push(mn);
        context.commit("setComparisonData", payload);
        context.commit("setChartData", data);
      }
    }
  }
});

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
        app.appquarter = response.data.d.results[0].Quarter;
        app.appyear = response.data.d.results[0].FiscalYear;
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
              "/_api/web/lists/getbytitle('VBURatios')/items?$top=5000&$select=Title,CoreRatio,OrganicGrowth,NetRevenue,VBULabel,LRCPortFolioManager,FiscalYear,Quarter&$filter=FiscalYear eq " +
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
                  "'&selectproperties='Title,FiscalYearOWSCHCS,QuarterOWSCHCS,owstaxIdLRCPortFolioManager'&rowlimit=500",
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

function getLengendData(ary) {
  app.lengendData = [];
  var prf = "";
  var wrk = {};
  $.each(ary, function(x, item) {
    wrk = {
      Color: item.Color,
      PortfolioMgr: item.ShortName,
      Manager: item.Name
    };
    app.lengendData.push(wrk);
  });
  store.commit("setPortfolioArrayData", app.lengendData);
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

// function getPorfolioData(response)
// {
//   var restAry = [], wrkAry = [];
//   var prtAry = [];
//   var nm;
//   if (response.data.d.results.length > 0) {
//     response.data.d.results.forEach(function (item) {
//       if (item.Title != null && item.Title.toLowerCase().indexOf("portfolio") > -1) {
//         if (item.LRCPortFolioManager != null) {
// 		  //nm = getTaxonomyValue(item, "LRCPortFolioManager");
// 		  nm = getPortfolioManagerName(item.Title, item.Quarter, item.FiscalYear, arry);
//           if (item.Title.toLowerCase().indexOf(nm.toLowerCase()) == -1)
//           {
//             var lc = restAry.filter(function (dta) {
//               return dta.Name == nm;
//             });
//             if (lc.length == 0) {
//               var mt = {
//                 Name: nm,
//                 Color: "",
//                 ShortName: ""
//               }
//               restAry.push(mt);
//             }

//             //
//             // wrk = {
//             //   x: getRatio(item.CoreRatio),
//             //   y: getOrganic(item.OrganicGrowth),
//             //   z: getRevenue(item.NetRevenue),
//             //   FiscalYear: item.FiscalYear,
//             //   Quarter: item.Quarter,
//             //   name: item.Title,
//             //   color: getNewColor(restAry, getTaxonomyValue(item, "LRCPortFolioManager")),
//             //   Manager: getTaxonomyValue(item, "LRCPortFolioManager"),
//             //   PositionX: item.XValue,
//             //   PositionY: item.YValue
//             //   //color: getColor(item.Title)
//             // }
//             // wrkAry.push(wrk);
//           }
//         }
//       }
//     });

//     restAry.forEach(function (item, idx) {
//       item.Color = getMgrColor(idx);
//       item.ShortName = item.Name.split(" ")[1] + " Portfolio";
//     });
//     store.commit('setCurrentManagers', restAry);

//     response.data.d.results.forEach(function (item) {
//       if (item.Title != null && item.Title.toLowerCase().indexOf("portfolio") > -1) {
//         if (item.LRCPortFolioManager != null) {
// 		  //nm = getTaxonomyValue(item, "LRCPortFolioManager");
// 		  nm = getPortfolioManagerName(item.Title, item.Quarter, item.FiscalYear, arry);
//           if (item.Title.toLowerCase().indexOf(nm.toLowerCase()) == -1) {
//             wrk = {
//               x: getRatio(item.CoreRatio),
//               y: getOrganic(item.OrganicGrowth),
//               z: getRevenue(item.NetRevenue),
//               FiscalYear: item.FiscalYear,
//               Quarter: item.Quarter,
// 			  name: item.Title,
// 			  color: getNewColor(restAry, getPortfolioManagerName(item.Title, item.Quarter, item.FiscalYear, arry)),
//               Manager: getPortfolioManagerName(item.Title, item.Quarter, item.FiscalYear, arry),
//             //   color: getNewColor(restAry, getTaxonomyValue(item, "LRCPortFolioManager")),
//             //   Manager: getTaxonomyValue(item, "LRCPortFolioManager"),
//             //  PositionX: item.XValue,
//              // PositionY: item.YValue
//               //color: getColor(item.Title)
//             }
//             wrkAry.push(wrk);
//           }
//         }
//       }
//     });

//     // var amt = 0, core = 0, og = 0, avr = 0;
//     // var yr = "", mn = "", cr = ""
//     // restAry.forEach(function(item){
//     //     var dt = wrkAry.filter(function(dta){
//     //         return dta.Manager == item.Name;
//     //     })
//     //     dt.forEach(function(data){
//     //         amt += data.z;
//     //         core += data.x;
//     //         og += data.y;
//     //         yr = data.FiscalYear;
//     //         mn = data.Quarter;
//     //         cr = data.color;
//     //     })
//     //     avr = Math.round(amt / dt.length);
//     //     core = Math.round(core / dt.length);
//     //     og = Math.round(og / dt.length);

//     //     var dr = {
//     //         Manager: item.Name,
//     //         name: item.ShortName,
//     //         FiscalYear: yr,
//     //         Quarter: mn,
//     //         color: cr,
//     //         z: amt,
//     //         AvgRevenue: avr,
//     //         x: core,
//     //         y: og,
//     //         vbu: dt.length
//     //     }
//     //     prtAry.push(dr);
//     //     amt = 0, core = 0, og = 0, avr = 0;
//     // })
//   }
//   store.commit("setChartData", wrkAry);
//   store.commit("setOriginalData", wrkAry);
//   getLengendData(restAry);
// }

function getVBUData(response, arry) {
  var restAry = [],
    wrkAry = [];
  if (response.data.d.results.length > 0) {
    response.data.d.results.forEach(function(item) {
      if (
        item.Title != null &&
        item.Title.toLowerCase().indexOf("portfolio") == -1
      ) {
        if (item.LRCPortFolioManager != null) {
          //var nm = getTaxonomyValue(item, "LRCPortFolioManager");
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
        if (item.LRCPortFolioManager != null) {
          wrk = {
            x: getRatio(item.CoreRatio),
            y: getOrganic(item.OrganicGrowth),
            z: getRevenue(item.NetRevenue),
            FiscalYear: item.FiscalYear,
            Quarter: item.Quarter,
            name: item.Title,
            Label: item.VBULabel,
            //   color: getNewColor(restAry, getTaxonomyValue(item, "LRCPortFolioManager")),
            //   Manager: getTaxonomyValue(item, "LRCPortFolioManager"),
            color: getNewColor(
              restAry,
              getPortfolioManagerName(
                item.Title,
                item.Quarter,
                item.FiscalYear,
                arry
              )
            ),
            Manager: getPortfolioManagerName(
              item.Title,
              item.Quarter,
              item.FiscalYear,
              arry
            )
            //PositionX: item.XValue,
            //PositionY: item.YValue
            //color: getColor(item.Title)
          };
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

// function getManager(mgr)
// {
//     var ary = []
//     mgr.forEach(function(item){
//         ary.push(item.split("|")[0]);
//     })
//     return ary;
// }

// function isSelectedManager(ary, mgr)
// {
//     var fnd = false;
//     $.each(ary, function(idx, item){
//         if (item.indexOf(mgr.split(" ")[1]) > -1)
//         {
//             fnd = true;
//             return false;
//         }
//     });
//     return fnd;
// }

// function getMangerColor(item, manager)
// {
//     var clr = "#000";
//     $.each(manager, function(idx, data){
//         if (data.split("|")[0].indexOf(item.Name.split(" ")[1]) > -1)
//         {
//             clr = data.split("|")[1];
//             return false;
//         }
//     })
//     return clr;
// }
