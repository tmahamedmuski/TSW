const http = require('http');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

async function run() {
    console.log("Fetching contacts...");
    http.get(`http://localhost:${PORT}/api/contacts`, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
            const json = JSON.parse(body);
            if (!json.data || json.data.length === 0) {
                console.log("No contacts to update");
                return;
            }
            const contact = json.data[0];
            const id = contact._id;
            
            console.log("Updating contact:", id);
            // Include _id in payload
            const updatePayload = { ...contact, title: "Updated Again!" };
            const updateData = JSON.stringify(updatePayload);
            
            const putOptions = {
                hostname: 'localhost',
                port: PORT,
                path: `/api/contacts/${id}`,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(updateData) }
            };

            const req = http.request(putOptions, (res2) => {
                let body2 = '';
                res2.on('data', c => body2 += c);
                res2.on('end', () => {
                    console.log("PUT STATUS:", res2.statusCode);
                    console.log("PUT BODY:", body2);
                });
            });
            req.write(updateData);
            req.end();
        });
    });
}
run();
