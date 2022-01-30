//*********************************************pbar******************************************************/
// Progress Bar

const constants = require("../../const");
const fetch = require('node-fetch');
const querystring = require('querystring');
const fs = require("fs");


function makeArr(num) {
    var arr = [];
    arr.push(100 - num);
    arr.push(num);
    return arr;
}

function rotation(num) {
    if (num <= 50) {
        return String(360 * num / 100);
    } else {
        return "0";
    }

}

function getColor(num) {
    if (num <= 35) {
        return 2;
    } else if (35 < num && num < 80) {
        return 1;
    } else {
        return 0;
    }
}

// async function plot(assignID, studentID) {
exports.plot9 = async (req, res) => {
    let parameters = {
        Assignment_id: req.query.Assignment_id
    };
    const studentID = req.query.studentID;
    let get_request_args = querystring.stringify(parameters);

    let url = "http://" + constants.hostname + ":" + String(constants.port) + '/api/assignmentscore/?' + get_request_args;

    let response = await fetch(url);
    let json = await response.json();
    var score = 0;

    json.forEach((doc) => {
        if (doc.User_id === studentID) {
            score = doc.Aconst;
        }

    })


    const num = score * 100 / 5;

    var ProgressBarData = makeArr(num);
    const colorIndex = getColor(num);
    console.log(colorIndex);

    const ProgressBarBgColor = [
        [

            'rgba(255, 255, 255, 0.6)',
            '#06d6a0',
        ],
        [

            'rgba(255, 255, 255, 0.6)',
            '#ffd166',
        ],
        [

            'rgba(255, 255, 255, 0.6)',
            '#ef476f',
        ],
    ];
    const ProgressBarBdColor = [
        [

            '#06d6a0',
            '#06d6a0',
            'rgba(75, 192, 192, 0.5)',
        ],
        [
            '#ffd166',
            '#ffd166',
        ],
        [
            '#ef476f',
            '#ef476f',
        ],
    ];

    const ProgressBarLabels = ["Completed", "In Progress"];

    var data = [{
        values: ProgressBarData,
        labels: ProgressBarLabels,
        textinfo: 'none',
        hoverinfo: 'none',
        insidetextorientation: "none",
        rotation: rotation(num),
        marker: {
            colors: ProgressBarBgColor[colorIndex],
            line: {
                color: ProgressBarBdColor[colorIndex],
                width: 1,
            }
        },
        hole: .9,
        type: 'pie'
    }];


    var layout = {
        annotations: [{
            font: {
                size: 40,
            },
            showarrow: false,
            text: score.toFixed(1),
        },],
        height: 500,
        width: 500,
        showlegend: false,
    };

    var config = {
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        displayModeBar: true,
        responsive: true
    };



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

// plot("607a7bcbc46da70004b6daad", "107633877048738957705")
//     .then(json => {
//         console.log(json);
//     })
//     .catch(err => {
//         console.log(err);
//     });


//*********************************************pbar******************************************************/