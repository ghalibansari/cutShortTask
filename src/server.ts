import server from "./app/app";
import { DB } from "./configs/DB";

const PORT = process.env.PORT || 4000;

server.listen(PORT, async () => {
  await DB();
  console.log("*************                           *************");
  console.log("*************       App started...      *************");
  console.log("*************                           *************");
  console.log(`PORT Number: ${PORT}`);

  process.on("SIGINT", () => {
    console.log("terminating");
    process.exit(0);
  });

  process.on("close", () => {
    console.log("Unexpected server shutdown");
  });
});
