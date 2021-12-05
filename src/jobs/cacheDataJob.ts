import { CronJob } from "cron";


const cron = new CronJob("*/10 * * * * *", async () => {
    try {
        console.log("test");
    } catch (e) {
        console.error(e);
    }
});

if (!cron.running) {
    console.log("start")
    cron.start();
}




