let xAxis1 = [], yAxis1 = [], sortedCases = [], populationArr = [], sortedCasesNum = [];

const fetchData1 = async () => {
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
            sortData1(apiData.response)
        })
        .then(fetchPopulation)
        .catch(err => {
            console.log(err);
        });
};

const requestPopInfo = async (countryName) => {
    return await fetch(`https://restcountries-v1.p.rapidapi.com/name/${countryName}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
            "x-rapidapi-key": "98061a671bmsh02ad22d36807bf3p113143jsn8aa932aabf70"
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data[0] ? data[0].population : null;
        })
        .catch(err => {
            console.log(err);
        });
}

const fetchPopulation = async () => {
    await new Promise(res => {
        sortedCases.forEach(async function (cases, index) {
            console.log(cases)
            if (cases.country !== 'All') {
                const population = await requestPopInfo(cases.country);
                populationArr.push(population);
                sortedCasesNum.push(cases.cases.active);
                xAxis1.push(cases.country);
            }
            if (index === sortedCases.length - 1) {
                res()
            }
        })

    }).then(makeMath)
}

const makeMath = async () => {
    console.log(populationArr, sortedCasesNum)
    await populationArr.forEach((el, index) => {
        el !== null ? yAxis1.push(sortedCasesNum[index] / el) : yAxis1.push(0)
    })

    console.log(yAxis1)
    drawChart1()
}

const sortData1 = (data) => {
    sortedCases = data.sort((a, b) => {
        return b.cases.active - a.cases.active
    });
}

const drawChart1 = () => {
    const cnvs = document.getElementById("virusChartPerPopulation").getContext("2d");
    const myChart = new Chart(cnvs, {
        type: "bar",
        data: {
            labels: xAxis1,
            datasets: [
                {
                    label: "# of Active Cases/Population",
                    data: yAxis1,
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

fetchData1();
