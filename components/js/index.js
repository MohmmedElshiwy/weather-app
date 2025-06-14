async function getApi(city = "cairo") {
  try {
    let res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=dc6b0e058e73400d816182605251306&q=${city}&days=3&aqi=no&alerts=no`
    );
    let data = await res.json();
    console.log(data);

    displayWather(data);
  } catch (error) {
    console.log("فشل في جلب البيانات:", error);
    document.querySelector(".now").innerHTML = `<h3>فشل في تحميل الطقس</h3>`;
  }
}

getApi();

function displayWather(data) {
  let forecastDays = data.forecast.forecastday;

  let cardsHTML = forecastDays
    .map((day) => {
      let date = new Date(day.date);
      let weekday = date.toLocaleDateString("en", { weekday: "long" }); //مغشوشة هههه
      let fullDate = date.toLocaleDateString();
      let condition = day.day.condition.text;
      let icon = day.day.condition.icon;
      let max = day.day.maxtemp_c;
      let min = day.day.mintemp_c;

      return `
          <div class="card col-md-3 p-3 text-center">
            <h4>${weekday}</h4>
            <p>${fullDate}</p>
            <img src="https:${icon}" alt="${condition}" width="100" />
            <h5 class="my-2">${condition}</h5>
            <p>🌡️ ${max}° / ${min}°</p>
          </div>
        `;
    })
    .join("");
  document.querySelector(".now").innerHTML = cardsHTML;
}

document.getElementById("searchBtn").addEventListener("click", () => {
  let city = document.getElementById("cityInput").value.trim();
  if (city !== "") {
    getApi(city);
  }
});
