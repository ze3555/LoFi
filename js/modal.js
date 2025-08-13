// js/modal.js
export function showModal(modal) {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
export function hideModal(modal) {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}