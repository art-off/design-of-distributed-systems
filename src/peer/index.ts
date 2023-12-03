import { Peer } from "peer/peer";

const main = async () => {
    const peer = new Peer();
    await peer.start();
}

main();
