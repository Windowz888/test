let chartUrl = `/api/monthly_crime_rate/`;

function init() {
    let dropDown = d3.select("#selDataset");

    // Fetch the available years from the database
    d3.json("/api/available_years").then((years) => {
        years.forEach(year => {
            dropDown.append("option")
                .text(year)
                .property("value", year);
        });

        let initialYear = years[0];
        buildLineChart(initialYear);
        buildPieChart(initialYear);
    });
}

function buildLineChart(sample){
  d3.json(chartUrl + sample).then((data)=>{
        function sorting(a, b) {
            if (a.year !== b.year) {
                return a.mci_category - b.mci_category;
            } else {
                const monthToNumber = {
                "January": 1,
                "February": 2,
                "March": 3,
                "April": 4,
                "May": 5,
                "June": 6,
                "July": 7,
                "August": 8,
                "September": 9,
                "October": 10,
                "November": 11,
                "December": 12
                };
                return monthToNumber[a.month] - monthToNumber[b.month];
            };
        };
        data.sort(sorting);
        const months = ["January","February","March","April","May","June","July", "August", "September", "October", "November", "December"]
        let majorCrimes = ["Assault", "Break and Enter", "Auto Theft", "Robbery", "Theft Over"]
        
        let task = {}
        majorCrimes.forEach(crime =>{
            task[crime]= [];
            let filtered = data.filter(results => results.mci_category == crime);
            months.forEach(month => {
                let filtered2 = filtered.filter(results => results.month == month);
                task[crime].push(filtered2.length)
            });
        })
      
        
        let trace = [{
            x: months,
            y: task.Assault,
            mode: "scatter",
            name: "Assault",
            line: {
              color: "rgb(60,25,0)",
              width: 1
            }
          },{
            x: months,
            y: task["Break and Enter"],
            mode: "scatter",
            name: "Break and Enter",
            line: {
              color: "rgb(13,15,54)",
              width: 1
            }
          },{
            x: months,
            y: task["Auto Theft"],
            mode: "scatter",
            name: "Auto Theft",
            line: {
              color: "rgb(141,15,22)",
              width: 1
            }
          },{
            x: months,
            y: task["Robbery"],
            mode: "scatter",
            name: "Robbery",
            line: {
              color: "rgb(131,141,22)",
              width: 1
            }
          },{
            x: months,
            y: task["Theft Over"],
            mode: "scatter",
            name: "Theft Over",
            line: {
              color: "rgb(22,151,44)",
              width: 1
            }
          }]
          let layout= {
            title: "Major Crime by Month" ,
            xaxis:{
              title: "Month"
            },
            paper_bgcolor: "#fff",
            yaxis: {
              title: "Number of crimes"
            },
            legend: {
              y: 0.5,
              traceorder:"reversed",
              font: {size:16},
              yref:"paper"
            }
          };
          Plotly.newPlot("line1", trace, layout);
    })
};

function buildPieChart(sample){
  d3.json(chartUrl + sample).then((data)=>{
    const months = ["January","February","March","April","May","June","July", "August", "September", "October", "November", "December"]
    let majorCrimes = ["Assault", "Break and Enter", "Auto Theft", "Robbery", "Theft Over"];
    
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
      function getRandomRGBString() {
        const red = getRandomNumber(0, 255);
        const green = getRandomNumber(0, 255);
        const blue = getRandomNumber(0, 255);
        return `rgb(${red},${green},${blue})`;
      };

    const rgbArray = [];
    
    for (let i = 0; i < 12; i++) {
      rgbArray.push(getRandomRGBString());
    }
    let allValues = {}
    majorCrimes.forEach(crime => {
        let filtered = data.filter(result => result.mci_category == crime)
        allValues[crime] = [];
        months.forEach(month =>{
            let filtered2 = filtered.filter(results => results.month == month);
            allValues[crime].push(filtered2.length)
        });
    });
    var trace = [{
        values: allValues["Assault"],
        labels: months,
        type: "pie",
        name: "Assault",
        title: "Assault",
        marker: {
          colors: rgbArray
        },
        domain: {
          row: 0,
          column: 0
        },
        hoverinfo: "label+percent+name",
        textinfo: "none"
       },{
        values: allValues["Break and Enter"],
        labels: months,
        type: "pie",
        name: "Break and Enter",
        title: "Break and Enter",
        marker: {
          colors: rgbArray
        },
        domain: {
          row: 0,
          column: 1
        },
        hoverinfo: "label+percent+name",
        textinfo: "none"
       }, {
        values: allValues["Auto Theft"],
        labels: months,
        type: "pie",
        name: "Auto Theft",
        title: "Auto Theft",
        marker: {
          colors: rgbArray
        },
        domain: {
          row: 1,
          column: 0
        },
        hoverinfo: "label+percent+name",
        textinfo: "none"
       }, {
        values: allValues["Robbery"],
        labels: months,
        type: "pie",
        name: "Robbery",
        title: "Robbery",
        marker: {
          colors: rgbArray
        },
        domain: {
          row: 1,
          column: 1
        },
        hoverinfo: "label+percent+name",
        textinfo: "none"
       }, {values: allValues["Theft Over"],
       labels: months,
       type: "pie",
       name: "Theft Over",
       title: "Theft Over",
       marker: {
         colors: rgbArray
       },
       domain: {
         row: 2,
         column: 0
       },
       hoverinfo: "label+percent+name",
       textinfo: "none"}]
       var layout = {
        title: "Major Crime by Month",
        height: 800,
        width: 800,
        paper_bgcolor: "#fff",
        grid: {rows: 3, columns: 2}
      };
    
        Plotly.newPlot('pie1', trace, layout)
    })
}

function optionChanged(value){
  buildPieChart(value);
  buildLineChart(value);
  year = value
  console.log(value)
}

init()