const accData = d3.csv("https://raw.githubusercontent.com/KishanBapodra/data-visualization-cwk2/master/data/accidents.csv?token=GHSAT0AAAAAACAD5ORMCXY2M6MFBXCFFCVOZBYDT7Q").then(data => data);
const nrgData = d3.csv("https://raw.githubusercontent.com/KishanBapodra/data-visualization-cwk2/master/data/energy-generation.csv?token=GHSAT0AAAAAACAD5ORMQRAFWHXKKUY3F4IAZBYDXSQ").then(data => data)
const yrlyData = d3.csv("https://raw.githubusercontent.com/KishanBapodra/data-visualization-cwk2/master/data/yearly_full_data.csv?token=GHSAT0AAAAAACAD5ORM2GPW6BCGBZGCTXVWZBYDYPQ").then(data => data)
const cstData = d3.csv("https://raw.githubusercontent.com/KishanBapodra/data-visualization-cwk2/master/data/cost-of-electricity.csv?token=GHSAT0AAAAAACAD5ORNPNBTDIQWTDWXAM56ZBYDWYA").then(data => data)
const dthData = d3.csv("https://raw.githubusercontent.com/KishanBapodra/data-visualization-cwk2/master/data/death-rates-from-energy-production-per-twh.csv?token=GHSAT0AAAAAACAD5ORNIVGIWSLNIL4GT7TMZBYDXCQ").then(data => data)
const emsnData = d3.csv("https://raw.githubusercontent.com/KishanBapodra/data-visualization-cwk2/master/data/life-cycle-greenhouse-emission.csv?token=GHSAT0AAAAAACAD5ORNODH3KBPRZVVDB3W4ZBYDYEQ").then(data => data)
const costCompData = d3.csv("https://raw.githubusercontent.com/KishanBapodra/data-visualization-cwk2/master/data/cost-of-electricity-compare.csv?token=GHSAT0AAAAAACAD5ORNL74E7AC6LD2VQPOWZBYDVWAv").then(data => data)

var accidentsData;
var energyData;
var costData;
var emissionData;
var fullData;
var deathData;
var filteredCostData;
var compareCostData;

const loadData = async () => {
    accidentsData = await accData;
    energyData = await nrgData;
    costData = await cstData;
    emissionData = await emsnData;
    deathData = await dthData;
    compareCostData = await costCompData;
    fullData = await yrlyData;
}

const sources = ['Coal power','Natural gas', 'Wind power','Biomass', 'Solar thermal/concentrated', 'Nuclear', 'Turbine (industrial)', 'Geothermal power','Fuel cells', 'Solar photovoltaic', 'Battery storage']
const filterLCOECosts = ["PV (residential)","PV (utility, fixed-axis)","PV (utility, tracking)"]
const continents = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"]

loadData().then(() => {

    // filter the energy sources
    filteredCostData = costData.filter(data => sources.includes(data.Type))
    // avg for sources with range of costs and change string value with comma to number
    filteredCostData = filteredCostData.map(element => {
        
        const dollarRemove = element["US-EIA"].split("$");
        if(element["US-EIA"].includes('-')) {
            const vals = dollarRemove[1].split("-");
            const avg = (parseFloat(vals[0].replace(/[^0-9.-]+/g,"")) + parseFloat(vals[1].replace(/[^0-9.-]+/g,""))) / 2;
            return {...element, "US-EIA": avg}
        }
        return {...element, "US-EIA": parseFloat(element["US-EIA"].replace(/[^0-9.-]+/g,""))}
    })
    compareCostData = compareCostData
                            .filter(data => !filterLCOECosts.includes(data.Type))
                            .map(data => {
                                    if(data["Lazard 2021"].includes('-')) {
                                        const val = data["Lazard 2021"].split('-')
                                        const average = (parseInt(val[0]) + parseInt(val[1]))/2
                                        return {...data, "Lazard 2021": average}
                                    }
                                    return data
                                })

    filteredEnergyData = energyData.filter(data => continents.includes(data.Entity) && data.Year === '2021')
    energyData = energyData.filter(data => continents.includes(data.Entity))

    barGraphAccidents(accidentsData);
    barGraphCost(compareCostData);
    economicDmg(accidentsData);
    barGraphCostComparison(compareCostData);
    lollipopChart(emissionData);
    barGraphDeaths(deathData);
    map(filteredEnergyData);
    update(energyData.filter(d => d.Entity === 'Europe'));
});