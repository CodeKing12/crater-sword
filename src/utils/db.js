import Database from "better-sqlite3";
import { isDev } from "solid-js/web";

const kjvDB = new Database("src/db/kjv.sqlite", {
	verbose: isDev ? console.log : undefined,
});
const strongLiteDB = new Database("src/db/strong-lite.sqlite", {
	verbose: isDev ? console.log : undefined,
});

export { kjvDB, strongLiteDB };
