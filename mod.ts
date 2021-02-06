// @see "https://deno.land/std@0.86.0/log"
import * as log from 'https://deno.land/std/log/mod.ts';
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js"

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: string[]
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
export async function downloadLaunchData(){
  if(import.meta.main) log.info("Downloading launch data...")
  const response = await fetch("https://api.spacexdata.com/v3/launches",{
    method:"GET"
  })

  if(!response.ok){
    if(import.meta.main) log.warning("Problem downloading launch data.")
    throw new Error("Launch data download failed.")
  }

  const launchData = await response.json()
  for(const launch of launchData){
    const payloads = launch["rocket"]["second_stage"]["payloads"]
    const customers = _.flatMap(payloads,(payload: any)=>{
      return payload["customers"]
    })
    const flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      customers
    }

    launches.set(flightData.flightNumber, flightData)
    if(import.meta.main) log.info(JSON.stringify(flightData))
  }
}

if(import.meta.main){
  downloadLaunchData();
  log.info(JSON.stringify(import.meta))
  log.info(`Downloaded data for ${launches.size} SpaceX launched`)
}
