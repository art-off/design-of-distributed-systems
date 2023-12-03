import { Peer } from "peer/peer";

const main = async () => {
    const peer = new Peer(1253);
    await peer.start();
}

main();
