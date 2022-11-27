const http = require('http')  
const XLSX = require('xlsx')
// const path = require('path')
const port = process.env.PORT || 8081
const host = process.env.HOST || 'localhost'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(express.static("public"))
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Allow-Credentials', true) 
    res.set("X-Download-Options", "noopen")
    next();
});

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>")
})

app.post('/', (req, res) => {
    // res.status(200).send(JSON.stringify(req.body));
    // if (req.url == "/") {
    let body = req.body
    let file = ''
        
    //     req.on('data', chunk => {
    // let json = JSON.parse(chunk)
    const slugify = require('slugify')

    const header = Object.entries(body.data).map((item) => {
        return item[1][0]
    }, [])

    const filename = slugify(body.municipio, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: true,     // strip special characters except replacement, defaults to `false`
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    })

    const info = body.data.map(row => {
        return row[1]
    })    
    
    const workBook = XLSX.utils.book_new()
    const workSheetData = [
        header,
        [...info]
    ]

    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData)
    XLSX.utils.book_append_sheet(workBook, workSheet, filename)
    // XLSX.writeFile(workBook, path.resolve(`./${filename}.xlsx`))
    
    file = XLSX.write(workBook, { type: 'base64' })
    // body += chunk.toString()    
    // return true
    //     })

    //     req.on('end', () => {
    //         res.end(JSON.stringify({ file: file }))
    //     })
    // }  
    res.status(200).send(JSON.stringify({ file: file }));
})

app.listen(process.env.PORT || 8081, 
	() => console.log("Server is running..."));

// var server = http.createServer(function(req, res){    

// }) 

// server.listen(port, host, function() {
//     console.log("App is running on port " + port)
// })