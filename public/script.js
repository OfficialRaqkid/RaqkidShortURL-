document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleTheme");
  const root = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "light";
  root.setAttribute("data-theme", savedTheme);
  toggle.checked = savedTheme === "dark";

  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "dark" : "light";
    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
});

function shortenUrl() {
  const urlInput = document.getElementById("longUrl");
  const result = document.getElementById("result");
  const longUrl = urlInput.value;

  fetch("/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: longUrl })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        result.textContent = data.error;
        result.style.color = "red";
      } else {
        result.innerHTML = `Shortened URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
        result.style.color = "green";
      }
    })
    .catch(() => {
      result.textContent = "An error occurred.";
      result.style.color = "red";
    });
}
