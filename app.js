var exec = require('child_process').exec;
const express = require('express');
const app = express();

const conf = require('./conf.js');


app.get("/", (req, res) => {
    let promise = new Promise((res, rej) => {
        exec(conf.cmd, function(err, stdout, stderr) {
            if (err) {
                rej(err)
            }
            // console.log(stdout)
            res(stdout);
        });
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