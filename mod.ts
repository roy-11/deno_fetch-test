async function downloadLaunchData(){
  const response = await fetch("https://api.spacexdata.com/v4/launches/latest",{
    method:"GET"
  })
  const data = await response.json()
  console.log(data)
}

downloadLaunchData();
