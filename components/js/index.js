window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        getApi(`${lat},${lon}`);
      },
      (error) => {
        // console.log("فشل في تحديد الموقع:", error.message);
        getApi("cairo"); 
      }
    );
  } else {
    console.log("The website does not support geolocation.");
    getApi("cairo"); 
  }
};

async function getApi(city = "cairo") {
  try {
    let res1 = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=dc6b0e058e73400d816182605251306&q=${city}&days=3&aqi=no&alerts=no`
    );
    let data1 = await res1.json();

    let res2 = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=dc6b0e058e73400d816182605251306&q=${city}&aqi=no`
    );
    let data2 = await res2.json();

    displayWeather(data1, data2);
  } catch (error) {
    document.querySelector(".now").innerHTML = `<h3>Error</h3>`;
  }
}

function displayWeather(data, data2) {
  let forecastDays = data.forecast.forecastday;
  let cityName = data.location.name;
  let currentWeather = data2.current.temp_c;

  let cardsHTML = `<h2 class="text-center mb-4">${cityName}</h2><div class="row justify-content-center">`;
  cardsHTML += forecastDays
    .map((day,index) => {
      let date = new Date(day.date);
      let weekday = date.toLocaleDateString("en", { weekday: "long" });
      let fullDate = date.toLocaleDateString();
      let condition = day.day.condition.text;
      let icon = day.day.condition.icon;
      let max = Math.floor(day.day.maxtemp_c);
      let min = Math.floor(day.day.mintemp_c);

      return `
        <div class="card col-md-4 gap-4 p-3 text-center">
          <h4>${weekday}</h4>
          <p>${fullDate}</p>
          <img src="https:${icon}" alt="${condition}" width="100" />
  ${
            index === 0
              ? `<h3>${currentWeather}°</h3>` 
              : ""
          }          <h5 class="my-2">${condition}</h5>
          <p>🌡️ ${max}° / ${min}°</p>
        </div>
      `;
    })
    .join("");

  document.querySelector(".now").innerHTML = cardsHTML;
}

document.getElementById("cityInput").addEventListener("input", () => {
  let city = document.getElementById("cityInput").value.trim();
  if (city !== "") {
    getApi(city);
  }
});
