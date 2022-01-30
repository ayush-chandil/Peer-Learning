const constants = require("../../const");
const fetch = require('node-fetch');
const querystring = require('querystring');
const fs = require("fs");


// getting data
// exports.plot = async (req, res) => {
exports.plot1 = async (req, res) => {

    const parameters = {
        Assignment_id: req.query.Assignment_id,
    }
    const get_request_args = querystring.stringify(parameters);
    console.log(get_request_args);

    const url = "http://" + constants.hostname + ":" + String(constants.port) + '/api/assignmentscore/?' + get_request_args;


    let response = await fetch(url);
    let json = await response.json();

    console.log(json);

    scoreData = [];
    reviewer = [];

    for (let i = 0; i < json.length; i++) {

        scoreData.push(json[i].Aconst.toFixed(2));

        reviewer.push(json[i].User_id);

    }


    var config = {
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        displayModeBar: true,
        responsive: true,
    };

    var data = [{
        x: reviewer,
        y: scoreData,
        type: 'bar',
        // width: 1.5,
        // offset: 20,
        hovertemplate: 'Consistency Score: %{y:.2f}<br>ID: %{x} <extra></extra>',
        text: scoreData.map(String),
        textposition: 'auto',
        // hoverinfo: 'none',
        marker: {
            color: 'rgba(255, 99, 132, 0.2)',
            opacity: 1,
            line: {
                color: 'rgba(255, 99, 132, 1)',
                width: 1.5
            }
        }
    }];

    var layout = {
        title: 'Class Consistency Score',
        width: 2500,
        height: 400,
        xaxis: {
            title: 'Student ID',
            autotypenumbers: 'strict',
        },
        yaxis: {
            title: 'Consistency Score',
        },
    }

    // const jsonData = JSON.stringify(data, null, 2);

    // fs.writeFile('../data.json', jsonData, err => {
    //     if (err) {
    //         console.log('Error writing file', err)
    //     } else {
    //         console.log('Successfully wrote file')
    //     }
    // });

    // const jsonConfig = JSON.stringify(config, null, 2);

    // fs.writeFile('../config.json', jsonConfig, err => {
    //     if (err) {
    //         console.log('Error writing file', err)
    //     } else {
    //         console.log('Successfully wrote file')
    //     }
    // });

    // const jsonLayout = JSON.stringify(layout, null, 2);

    // fs.writeFile('../layout.json', jsonLayout, err => {
    //     if (err) {
    //         console.log('Error writing file', err)
    //     } else {
    //         console.log('Successfully wrote file')
    //     }
    // });


    let final_return = { "data": data, "config": config, "layout": layout };
    res.status(200).send(final_return);



}

// plot("607a7bcbc46da70004b6daad").then((result) => {
//     console.log(result.data);
//     console.log(result.config);
//     console.log(result.layout);
// });;


