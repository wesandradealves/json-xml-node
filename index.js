const http = require('http')  
const exportFromJSON = require('export-from-json')  
const XLSX = require('xlsx');
const path = require('path');
const { raw } = require('body-parser');
const port = process.env.PORT || 8081;
const host = process.env.HOST || 'localhost';

var server = http.createServer(function(request, response){    
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Access-Control-Allow-Credentials', true); 
    response.setHeader("X-Download-Options", "noopen");

    if (request.url == "/") {
        let body = '';
        let file = '';
        
        request.on('data', chunk => {
            let json = JSON.parse(chunk);
            const slugify = require('slugify');
    
            const header = Object.entries(json.data).map((item) => {
                return item[1][0]
            }, []);

            const filename = slugify(json.municipio, {
                replacement: '-',  // replace spaces with replacement character, defaults to `-`
                remove: undefined, // remove characters that match regex, defaults to `undefined`
                lower: true,      // convert to lower case, defaults to `false`
                strict: true,     // strip special characters except replacement, defaults to `false`
                trim: true         // trim leading and trailing replacement chars, defaults to `true`
            });

            const info = json.data.map(row => {
                return row[1]
            });    
            
            const workBook = XLSX.utils.book_new();
            const workSheetData = [
                header,
                [...info]
            ];

            const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
            XLSX.utils.book_append_sheet(workBook, workSheet, filename);
            // XLSX.writeFile(workBook, path.resolve(`./${filename}.xlsx`));
            
            file = XLSX.write(workBook, { type: 'base64' })
            // body += chunk.toString();    
            return true;            
        });

        request.on('end', () => {
            response.end(JSON.stringify({ file: file }));
        });     
    }  
}); 

server.listen(port, host); 

// http.createServer(function (request, response) {  
//     response.setHeader('Access-Control-Allow-Origin', '*');
//     response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     response.setHeader('Access-Control-Allow-Credentials', true); 
//     response.setHeader("X-Download-Options", "noopen");

//     if (request.url == "/") {
//         let body = '';
//         let file = '';
        
//         request.on('data', chunk => {
//             let json = JSON.parse(chunk);
//             const slugify = require('slugify');
    
//             const header = Object.entries(json.data).map((item) => {
//                 return item[1][0]
//             }, []);

//             const filename = slugify(json.municipio, {
//                 replacement: '-',  // replace spaces with replacement character, defaults to `-`
//                 remove: undefined, // remove characters that match regex, defaults to `undefined`
//                 lower: true,      // convert to lower case, defaults to `false`
//                 strict: true,     // strip special characters except replacement, defaults to `false`
//                 trim: true         // trim leading and trailing replacement chars, defaults to `true`
//             });

//             const info = json.data.map(row => {
//                 return row[1]
//             });    
            
//             const workBook = XLSX.utils.book_new();
//             const workSheetData = [
//                 header,
//                 [...info]
//             ];

//             const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
//             XLSX.utils.book_append_sheet(workBook, workSheet, filename);
//             // XLSX.writeFile(workBook, path.resolve(`./${filename}.xlsx`));
            
//             file = XLSX.write(workBook, { type: 'base64' })
//             // body += chunk.toString();    
//             return true;            
//         });

//         request.on('end', () => {
//             response.end(JSON.stringify({ file: file }));
//         });     
//     }
// }).listen(port, host)  

