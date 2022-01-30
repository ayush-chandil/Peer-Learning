// ******************************** < API selfVsClassAvg > ***********************************/

const constants = require("../../const");

const fetch = require('node-fetch');
const querystring = require('querystring');
const fs = require("fs");


exports.plot7 = async (req, res) => {
    // Question Labels
    const parameters = {
        peer_assignment_id: req.query.peer_assignment_id,
    }
    const selfID = req.query.studentID;
    const get_request_args = querystring.stringify(parameters);
    console.log(get_request_args);

    const url = "http://" + constants.hostname + ":" + String(constants.port) + '/api/peeractivity/?' + get_request_args;


    var result = "";

    data = [];
    reviewer = [];
    authors = [];

    let response = await fetch(url);
    let json = await response.json();

    // Question Labels


    let queLabels = [];
    var selfData = [];
    var classAvgData = [];

    var i = 0;
    for (i = 1; i <= json[0].review_score.length; i++) {
        queLabels.push('Q' + i);
        selfData.push(0);
        classAvgData.push(0);

    }
    console.log(queLabels);

    // Self Marks



    let selfReviewers = 0;
    let classReviewers = 0;
    var authors = {};


    json.forEach((doc) => {
        if (!(doc.author_id in authors)) {
            authors[doc.author_id] = true;
        }
        if (doc.author_id == selfID && doc.author_id != doc.reviewer_id) {
            selfReviewers++;

            for (var i = 0; i < doc.review_score.length; i++) {

                selfData[i] += doc.review_score[i];
            }



        }
    });

    for (var i = 0; i < selfData.length; i++) {
        selfData[i] = selfData[i] / selfReviewers;
    }

    // Class Avg Marks

    for (const [key, value] of Object.entries(authors)) {

        json.forEach((doc) => {
            if (doc.author_id == key && doc.author_id != doc.reviewer_id) {
                classReviewers++;
                for (var i = 0; i < doc.review_score.length; i++) {
                    classAvgData[i] += doc.review_score[i];
                }
            }

            // console.log(doc.review_score);
        });

    }

    for (var i = 0; i < classAvgData.length; i++) {
        classAvgData[i] = classAvgData[i] / classReviewers;
    }


    // console.log(selfReviewers);
    // console.log(classReviewers);
    // console.log(selfData);
    // console.log(classAvgData);

    // Plotly Data

    var trace0 = {
        x: queLabels,
        y: classAvgData,
        name: "Class Avg.",
        text: classAvgData,
        textposition: 'auto',
        // hovertemplate: reviewer[0] + ' - %{y:.2f}<extra></extra>',
        hoverinfo: 'none',
        marker: {
            color: constants.backgroundColor[0],
            opacity: 1,
            line: {
                color: constants.borderColor[0],
                width: 1
            }
        },

        type: 'bar'
    };

    var trace1 = {
        x: queLabels,
        y: selfData,
        name: "Self",
        text: selfData,
        textposition: 'auto',
        // hovertemplate: reviewer[1] + ' - %{y:.2f}<extra></extra>',
        hoverinfo: 'none',
        marker: {
            color: constants.backgroundColor[4],
            opacity: 1,
            line: {
                color: constants.borderColor[4],
                width: 1
            }
        },
        type: 'bar'
    };




    var data = [trace0, trace1];

    var config = {
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        responsive: true,
        displayModeBar: true
    };


    var layout = {
        title: 'Self Vs. Class Avg',
        barmode: 'group',
        // width: 700,
        // height: 400,
        xaxis: {
            title: 'Question',
            autotypenumbers: 'strict',
        },
        yaxis: {
            title: 'Score',
            autotypenumbers: 'strict',
        },
        // bargap: 1
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


// plot("607a7bcbc46da70004b6daad", "107478614765781013827");