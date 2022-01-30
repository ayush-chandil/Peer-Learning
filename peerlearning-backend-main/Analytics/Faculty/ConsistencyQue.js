const constants = require("../../const");
const fetch = require('node-fetch');
const querystring = require('querystring');
const fs = require("fs");

exports.plot4 = async (req, res) => {






    const parameters = {
        peer_assignment_id: req.query.peer_assignment_id,
    }
    const studentID = req.query.studentID;
    const get_request_args = querystring.stringify(parameters);
    console.log(get_request_args);

    const url = "http://" + constants.hostname + ":" + String(constants.port) + '/api/peeractivity/?' + get_request_args;


    var result = "";

    scoreData = [];
    reviewer = [];
    authors = [];

    let response = await fetch(url);
    let json = await response.json();

    // Question Labels


    let queLabels = [];

    var i = 0;
    for (i = 1; i <= json[0].review_score.length; i++) {
        queLabels.push('Q' + i);
    }
    console.log(queLabels);

    let ctr = 0;
    for (let i = 0; i < json.length; i++) {

        if (json[i].reviewer_id == studentID) {
            ctr++;

            scoreData.push(json[i].review_score);
            authors.push(json[i].author_id);
            reviewer.push('R' + ctr);
        } else {
            continue;
        }
    }



    //********************** Plotly parametrs here **************************

    var data = [];

    for (let i = 0; i < scoreData.length; i++) {
        let temp = {
            y: scoreData[i],
            x: queLabels,
            name: reviewer[i] + '  (' + authors[i] + ')',
            text: scoreData[i],
            textposition: 'auto',
            // hovertemplate: reviewer[0] + ' - %{y:.2f}<extra></extra>',
            hoverinfo: 'none',
            marker: {
                color: constants.backgroundColor[i],
                opacity: 1,
                line: {
                    color: constants.borderColor[i],
                    width: 1
                }
            },

            type: 'bar'
        };

        data.push(temp);

    }

    var config = {
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        displayModeBar: true,
        responsive: true
    };


    var layout = {
        title: 'Consistency of ' + studentID,
        barmode: 'group',
        xaxis: {
            title: 'Question',
            autotypenumbers: 'strict',
        },
        yaxis: {
            title: 'Consistency Score',
            autotypenumbers: 'strict',
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


// plot("607a7bcbc46da70004b6daad", "101973615462290612505")