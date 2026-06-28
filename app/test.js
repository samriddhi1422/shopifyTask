import dns from "node:dns";

dns.resolveSrv(
  "_mongodb._tcp.cluster0.l6geyuo.mongodb.net",
  (err, addresses) => {
    console.log("Error:", err);
    console.log("Addresses:", addresses);
  }
);