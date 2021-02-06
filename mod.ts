// @see "https://deno.land/std@0.86.0/log"
import * as log from 'https://deno.land/std/log/mod.ts';

// logger setting
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: "WARNING",
      handlers: ["console"],
    },
  },
});

// @see "https://github.com/r-spacex/SpaceX-API"
async function downloadLaunchData(){
  log.info("Downloading launch data...")
  const response = await fetch("https://api.spacexdata.com/v4/launches/latest",{
    method:"GET"
  })

  if(!response.ok){
    log.warning("Problem downloading launch data.")
    throw new Error("Launch data download failed.")
  }

  const data = await response.json()
  console.log(data)
}

downloadLaunchData();
