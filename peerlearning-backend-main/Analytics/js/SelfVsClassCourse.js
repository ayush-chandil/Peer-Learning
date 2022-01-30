//*********************************************<Line Chart>******************************************************/
// export const ele = document.querySelector('#line-self-vs-classAvg');
// export const subAssignments = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"];
// export const selfMarks = [9, 8, 8, 5, 7, 10, 6, 7, 7, 6];
// export const classAvgMarks = [3, 3.5, 4, 9, 10, 7, 5, 8, 5, 10];
const constants = require("../../const");
const fetch = require('node-fetch');
const querystring = require('querystring');
const fs = require("fs");

exports.plot8 = async (req, res) => {

    var selfMarks = [];
    var classAvgMarks = [];

    let parameters = {
        course_id: req.query.courseID,
    }
    const studentID = req.query.studentID;
    let get_request_args = querystring.stringify(parameters);


    let url = "http://" + constants.hostname + ":" + String(constants.port) + '/api/assignment/?' + get_request_args;

    let response = await fetch(url);
    let json = await response.json();

    for (let i = 0; i < json.length; i++) {
        // console.log(json[i]._id);

        parameters = { Assignment_id: json[i]._id };
        get_request_args = querystring.stringify(parameters);

        url = "http://" + constants.hostname + ":" + String(constants.port) + '/api/assignmentscore/?' + get_request_args;

        let response2 = await fetch(url);
        let json2 = await response2.json();

        let clsAvg = [];

        for (let j = 0; j < json2.length; j++) {
            if (json2[j].User_id == studentID) {
                selfMarks.push(json2[j].final_grade);
            } else {
                clsAvg.push(json2[j].final_grade);
            }
        }

        classAvgMarks.push(constants.average(clsAvg));

    }




    var data = [];

    for (var i = 0; i < selfMarks.length; i++) {
        var trace = {
            x: [selfMarks[i], classAvgMarks[i]],
            y: ["self", "ClassAvg"],
            hovertemplate: 'A' + i + '<extra></extra>',
            text: [selfMarks[i], classAvgMarks[i]],
            textposition: 'auto',
            type: 'bar',
            orientation: 'h',
            marker: {
                color: constants.backgroundColor,
                opacity: 1,
                line: {
                    color: constants.borderColor,
                    width: 1
                }
            },

        };

        data.push(trace);
    }


    var config = {
        showLink: true,
        plotlyServerURL: "https://chart-studio.plotly.com",
        displayModeBar: true,
        responsive: true
    };


    var layout = {
        title: 'Self Vs. Class Avg',
        barmode: 'stack',
        xaxis: {
            title: 'Assignments',
            autotypenumbers: 'strict',
        },
        yaxis: {
            title: 'Score',
            autotypenumbers: 'strict',
        },

    }


    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFile('../data.json', jsonData, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    });

    const jsonConfig = JSON.stringify(config, null, 2);

    fs.writeFile('../config.json', jsonConfig, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    });

    const jsonLayout = JSON.stringify(layout, null, 2);

    fs.writeFile('../layout.json', jsonLayout, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    });



    let final_return = { "data": data, "config": config, "layout": layout };
    res.status(200).send(final_return);

}



// plot("249509627957", "107478614765781013827")
//     .then(result => {
//         console.log(result.data);
//     })
//     .catch(err => {
//         console.log(err);
//     });
//*********************************************<END Line Chart>******************************************************/