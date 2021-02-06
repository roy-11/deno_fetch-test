// @see "https://deno.land/std@0.86.0/log"
import * as log from 'https://deno.land/std/log/mod.ts';

interface Launch {
  flightNumber: number;
  mission: string;
}
const launches = new Map<number,Launch>();

// logger setting
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

// @see "https://github.com/r-spacex/SpaceX-API"
async function downloadLaunchData(){
  log.info("Downloading launch data...")
  const response = await fetch("https://api.spacexdata.com/v4/launches",{
    method:"GET"
  })

  if(!response.ok){
    log.warning("Problem downloading launch data.")
    throw new Error("Launch data download failed.")
  }

  const launchData = await response.json()
  for(const launch of launchData){
    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["name"]
    }

    launches.set(flightData.flightNumber, flightData)
    log.info(JSON.stringify(flightData))
  }
}

downloadLaunchData();
