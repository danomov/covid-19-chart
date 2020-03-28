function handleVirusCasePerPopPercentageChart() {
    let countries = [], percentage = [], sortedCases = [], populationQuantity = [], sortedCaseQuantity = [];

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
                sortData(apiData.response)
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
                if (data.length > 1) {
                    const country = data.filter((el) => el.name.length == countryName.length)
                    return country[0]
                }
                return data[0] ? data[0].population : null;
            })
            .catch(err => {
                console.log(err);
            });
    }

    const fetchPopulation = async () => {
        await new Promise(res => {
            sortedCases.forEach(async function (cases, index) {
                if (cases.country !== 'All') {
                    const population = await requestPopInfo(cases.country);
                    populationQuantity.push(population);
                    sortedCaseQuantity.push(cases.cases.active);
                    countries.push(cases.country);
                }
                if (index === sortedCases.length - 1) {
                    res()
                }
            })

        }).then(makeMath)
    }

    const makeMath = async () => {
        populationQuantity.forEach((population, index) => {
            population !== null ? percentage.push(sortedCaseQuantity[index] / population) : percentage.push(0)
        })

        drawChart()
    }

    const sortData = (data) => {
        sortedCases = data.sort((a, b) => {
            return b.cases.active - a.cases.active
        });
    }

    const drawChart = () => {
        const cnvs = document.getElementById("virusChartPerPopulation").getContext("2d");
        const virusChart = new Chart(cnvs, {
            type: "bar",
            data: {
                labels: countries,
                datasets: [
                    {
                        label: "# of Active Cases/Population",
                        data: percentage,
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1
                    }
                ]
            }
        });
    };

    fetchData();
}


handleVirusCasePerPopPercentageChart()