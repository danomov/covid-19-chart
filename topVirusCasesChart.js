Chart.platform.disableCSSInjection = true;

let xAxis = [], yAxis = [];

const fetchData = async () => {
    await fetch("https://covid-193.p.rapidapi.com/statistics", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "98061a671bmsh02ad22d36807bf3p113143jsn8aa932aabf70"
        }
    })
        .then(response => {
            return response.json()
        })
        .then(apiData => {
            return sortData(apiData.response)
        })
        .then(sorted => {
            fillData(sorted);
        })
        .catch(err => {
            console.log(err);
        });
};

const sortData = (data) => {
    const sortedData = data.sort((a, b) => {
        return b.cases.active - a.cases.active
    });

    return sortedData
}

const fillData = async (data) => {
    await data.slice(0, 70).forEach(selection => {
        if (selection.country !== 'All') {
            xAxis.push(selection.country);
            yAxis.push(selection.cases.active)
        }
    });

    drawChart()
}

const drawChart = () => {
    const cnvs = document.getElementById("virusChartTop70").getContext("2d");
    const myChart = new Chart(cnvs, {
        type: "bar",
        data: {
            labels: xAxis,
            datasets: [
                {
                    label: "# of Active Cases",
                    data: yAxis,
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1
                }
            ]
        }
        // options: {
        //     scales: {
        //         yAxes: [{
        //             ticks: {
        //                 beginAtZero: true
        //             }
        //         }]
        //     }
        // }
    });
};

fetchData();
