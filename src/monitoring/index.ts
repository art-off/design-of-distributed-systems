import {Monitor} from "./monitor";
import express from "express";


const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/monitoring', async (req, res) => {
    const monitor = new Monitor();
    const peersInfo = await monitor.getPeersInfo();
    res.json(peersInfo)
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});