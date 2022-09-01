// Import modules
import axios from "axios";
import * as https from "https";
import { EMAIL_REGEX, onlyNumber, PHONE_MASK, UNSIGNED_NUMBER_REGEX, URL_REGEX } from "./utils/common";

// Load test data
// import localData from "./data/records.json";

/**
 * Calculate the average balance of the records.
 *
 * Task: This seems pretty straightforward but could it be improved? Maybe
 * more declarative?
 *
 * @param localData array of objects
 * @returns number
 */
export function calculateAvgBalance(array: Array<{ balance: string }>): number {
  const length = array.length;
  const total = array.reduce((accum, current) => {
    //get the sum
    return (accum += onlyNumber(String(current.balance)));
  }, 0);

  return total / length;
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops. The test is also failing for some reason 🤦.
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function findTagCounts(localData: Array<SampleDateRecord>): Array<TagCounts> {
  const tags: Array<string> = [];
  localData.forEach((element) => {
    tags.push(...element.tags);
  });

  const tagCounts = tags.reduce((accum: Array<TagCounts>, current: string) => {
    const found = accum.findIndex((item) => item.tag === current);
    found >= 0 ? accum[found].count++ : accum.push({ tag: current, count: 1 });
    return accum;
  }, []);

  return tagCounts;
}

/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they
 * are all fetched at once then when they are done, return all the
 * titles? I also feel like something is missing here. Not
 * conforming to a standard maybe?
 *
 * @returns array of strings
 */
export async function returnSiteTitles(): Promise<string[]> {
  const urls = ["https://www.thetrevorproject.org/", "https://www.startrek.com/", "https://bwfbadminton.com/"];

  const titles: any = [];

  const agent = new https.Agent({ keepAlive: true, rejectUnauthorized: false });

  const getArray = urls.map(
    async (url) =>
      await axios.get(url, {
        httpsAgent: agent,
        headers: {
          accept: "*/*",
          host: "www.thetrevorproject.org",
          "accept-encoding": "gzip, deflate, br",
          connection: "keep-alive"
        }
      })
  );

  await Promise.all(getArray)
    .then((res) => {
      res.forEach((response) => {
        titles.push(response.data.match(/<title>(.*?)<\/title>/));
      });
    })
    .catch((err) => {
      if (err.response) {
        // console.log(err.response.data);
        // console.log(err.response.status);
        // console.log(err.response.headers);
        return err.response;
      } else if (err.request) {
        // console.log(err.request);
        return err.request;
      } else {
        // console.log("Error: ", err.message);
        return err.message;
      }
    });

  return titles;
}

/**
 * Reformat and validate some of the fields into proper types.
 *
 * Task: This seems a bit verbose. Add proper validation where
 * the comments suggest it. Feel free to modify anything
 * TypeScript-related if you need to 😉. External libraries
 * are fine to use. Could more native language features be
 * used to make it cleaner?
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function reformatData(localData: Array<SampleDateRecord>): Array<SampleDateRecord> {
  let reformattedData: Array<SampleDateRecord> = [];

  reformattedData = localData.map((element) => {
    let { picture, email } = element;
    picture = String(picture) || "";
    email = String(email) || "";

    //check if picture URL is valid
    if (!URL_REGEX.test(picture)) element.picture = null;

    //check if email string is valid
    if (!EMAIL_REGEX.test(email)) {
      element.email = null;
    }

    //conversion to number
    element.balance = onlyNumber(String(element.balance));

    //reformat phone
    element.phone = element.phone.replace(UNSIGNED_NUMBER_REGEX, "").replace(PHONE_MASK, "$1.$2.$3.$4");

    element.registered = new Date(element.registered.replace(" ", "")).toISOString();

    return element;
  });

  return reformattedData;
}

/**
 * Build out a HTML <ul> list of names.
 *
 * Task: Can you make this more concise, less error-prone, and more declarative?
 *
 * @param localData array of objects
 * @returns string
 */
export function buildAList(localData: Array<SampleDateRecord>): string {
  return (
    localData.reduce((accum, current) => {
      accum += "<li>" + current.name + "</li>";
      return accum;
    }, "<ul>") + "</ul>"
  );
}

/**
 * Filter the data by age with an optional limit.
 *
 * Task: The code looks a little smelly to me. Can you make it cleaner and
 * easier to follow? Bonus points for a more declarative approach.
 *
 * @param localData array of objects
 * @param age number
 * @param count number
 * @returns array of objects
 */
export function filterAgeGreaterThan(
  localData: Array<SampleDateRecord>,
  age: number,
  count = 0
): Array<SampleDateRecord> {
  const filteredData: Array<SampleDateRecord> = localData.filter((element) => element.isActive && element.age > age);

  return count ? filteredData.splice(0, count) : filteredData;
}

/**
 * A random function that does a number of things for Twilio Flex.
 *
 * Task: Don't worry about what this function is doing. There is no test
 * for this to pass. Rather, your task here is to simply try to improve on
 * the code that is here. Can you make it more concise and readable? Should
 * anything be added, abstracted, or removed?
 *
 * @param flex Flex object
 * @param manager manager object
 */
export function doALotOfStuff(flex: any, manager: any): void {
  /**
   * Variable to save the current worker
   */
  const { sid } = manager.workerClient;

  // Ignore this function.
  function displayContainer(value: string): void {
    console.log(value);
  }

  manager.insightsClient.liveQuery("tr-task", `data.worker_sid == "${sid}"`).then((args: Record<string, any>) => {
    const otherTask = new Map();
    const assignedTask = new Map();
    const items = args.getItems();
    Object.entries<any>(items).forEach(([key, value]) => {
      otherTask.set(key, value);
      if (value.status === "assigned" || value.status === "wrapping") {
        otherTask.delete(key);
        assignedTask.set(key, value);
      }
    });

    if (assignedTask.size <= 1) {
      displayContainer("none");
      flex.Actions.invokeAction(
        "HistoryPush",
        "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
      );
    } else {
      displayContainer("block");
    }

    manager.events.addListener("selectedViewChanged", (viewName: string) => {
      if (viewName === "agent-desktop" && assignedTask.size <= 1) {
        displayContainer("none");
        flex.Actions.invokeAction(
          "HistoryPush",
          "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
        );
      }
    });

    args.on("itemUpdated", (args: any) => {
      if (args.value.status === "assigned") {
        otherTask.delete(args.key);
        assignedTask.set(args.key, args.value);
      } else if (args.value.status === "wrapping") {
        otherTask.delete(args.key);
      } else {
        otherTask.set(args.key, args.value);
      }

      if (assignedTask.size <= 1 && window.location.href.includes("agent-desktop")) {
        displayContainer("none");
        flex.Actions.invokeAction(
          "HistoryPush",
          "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
        );
      } else {
        displayContainer("block");
      }
    });

    args.on("itemRemoved", (args: any) => {
      otherTask.delete(args.key);
      assignedTask.delete(args.key);
      if (assignedTask.size <= 1) {
        displayContainer("none");
        flex.Actions.invokeAction(
          "HistoryPush",
          "/agent-desktop/" + Array.from(manager.workerClient.reservations.keys())[0]
        );
      } else {
        displayContainer("block");
      }
    });
  });
}

/* eslint-disable */
// (async () => {
//   console.log(
//     calculateAvgBalance(localData)
//     // findTagCounts(localData),
//     // await returnSiteTitles(),
//     // reformatData(localData),
//     // buildAList(localData)
//   );
// })();
