window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getApi(`${lat},${lon}`);
      },
      () => getApi("cairo") // fallback
    );
  } else {
    getApi("cairo"); // fallback
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
  } catch {
    document.querySelector(".now").innerHTML = `<h3>Error</h3>`;
  }
}

function displayWeather(data, data2) {
  let forecastDays = data.forecast.forecastday;
  let cityName = data.location.name;
  let currentWeather = data2.current.temp_c;

  let cardsHTML = `<h2 class="text-center mb-4">${cityName}</h2>`;
  cardsHTML += forecastDays
    .map((day, index) => {
      let date = new Date(day.date);
      let weekday = date.toLocaleDateString("en", { weekday: "long" });
      let fullDate = date.toLocaleDateString();
      let condition = day.day.condition.text;
      let icon = day.day.condition.icon;
      let max = Math.floor(day.day.maxtemp_c);
      let min = Math.floor(day.day.mintemp_c);

      return `
        <div class="col-md-4">
          <div class="card p-3 text-center h-100">
            <h4>${weekday}</h4>
            <p>${fullDate}</p>
            <img src="https:${icon}" alt="${condition}" width="100" />
            ${
              index === 0
                ? `<h3>${currentWeather}°</h3>`
                : ""
            }
            <h5 class="my-2">${condition}</h5>
            <p>🌡️ ${max}° / ${min}°</p>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelector(".now").innerHTML = cardsHTML;

  // Add show class after rendering
  setTimeout(() => {
    document.querySelectorAll('.card').forEach((el) => {
      el.classList.add('show');
    });
  }, 100);
}

document.getElementById("cityInput").addEventListener("input", () => {
  let city = document.getElementById("cityInput").value.trim();

  if (city !== "") {
    getApi(city);
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          let lon = position.coords.longitude;
          getApi(`${lat},${lon}`);
        },
        () => getApi("cairo") // fallback لو في خطأ
      );
    } else {
      getApi("cairo");
    }
  }
});
mode.onclick = function () {
  document.body.classList.toggle("dark");
  mode.classList.toggle("btn-warning");
  mode.classList.toggle("btn-light");

  let icon = mode.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
};
