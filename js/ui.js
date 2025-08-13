// js/ui.js
export function setUserEmail(email) {
  const el = document.getElementById("user-email");
  el.textContent = email;
  el.title = email;
}

export function toggleAdminBadge(show) {
  const badge = document.getElementById("admin-badge");
  if (show) badge.classList.remove("hidden");
  else badge.classList.add("hidden");
}

// ...можно добавить любые утилиты для обновления интерфейса