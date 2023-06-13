const fs = require('fs')


const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/'){
        res.write('<html>');
        res.write('<body><form action="/users" method="POST"><input type="text" name="username"><button type="submit">Send</button></form></body>')
        res.write('</html>');
        return res.end();
    }
    if(url === '/users'){
        res.write('<html>');
        res.write('<body><h1>USER LIST</h1></body>')
        res.write('<body><ul><li>John</li><li>Peter</li><li>Mario</li><li>Pedro</li></ul></body>')
        res.write('</html>');
        return res.end();
    }
    if(url === '/create-user' && method === 'POST'){
        const body = []
        req.on('data', (chunk) =>{
            console.log(chunk);
            body.push(chunk)
        })
        return req.on('end', () =>{
            const parseBody = Buffer.concat(body).toString()
            const user = parseBody.split('=')[1];
            console.log('New User:', user);
            res.statusCode = 201;
            return res.end();
        })
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>TESTING</title></head>')
    res.write('<body><h1>sup?</h1></body>')
    res.write('</html>')
}

module.exports = requestHandler