(function () {
  var dialog = document.querySelector('.real-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var photo = dialog.querySelector('img');
  var caption = dialog.querySelector('.real-lightbox-caption');
  document.querySelectorAll('.real-photo-open').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      photo.src = link.href;
      photo.alt = link.querySelector('img').alt;
      caption.textContent = link.dataset.galleryTitle;
      dialog.showModal();
    });
  });
  dialog.querySelector('.real-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) {
      var box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
})();
