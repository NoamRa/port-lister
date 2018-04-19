const exec = require('child_process').exec;
const express = require('express');
const app = express();

const conf = require('./conf.js');

const template = 

app.get("/", (req, res) => {
    let promise = new Promise((res, rej) => {
        exec(conf.cmd, function(err, stdout, stderr) {
            if (err) {
                rej(err)
            }
            res(stdout);
        });
    })
    // transform command output to json with port, process name and process id
    .then(rawResults => {
        const resArr = rawResults.split("\n");
        let serverDataList = resArr.map(line => {
            return line.split(' ').filter(x => 
                !!x && 
                x !== '0' && 
                x !== ':::*' && x !== '0.0.0.0:*' 
                && x !== 'LISTEN' && 
                x !== 'tcp' && x !== 'tcp6')
        });
        const portList = serverDataList.map(line => line[0] ? line[0].slice(line[0].lastIndexOf(':')+1) : null);
        let resObj = {};
        for (let i = 0; i < portList.length; i++) {
            if (portList[i]) {
                resObj[portList[i]] = {
                    'port': portList[i],
                    'process_name': serverDataList[i][1].slice(serverDataList[i][1].indexOf('/')+1),
                    'pid': serverDataList[i][1].slice(0, serverDataList[i][1].indexOf('/')),
                };
            };
        };

        return {
            serverData: resObj, 
            resArr: resArr,
        };
    })
    


    .then(x => {
        res.status(200);
        res.send(x);
    })
    .catch(err => {
        res.status(500);
        res.send(err);
    })
});

// redirect anything else
app.get("/*", (req, res) => {
    res.redirect(302, "/");
})

app.listen(conf.port, function(){
    console.log(`Listening on http://localhost:${conf.port}`);
});