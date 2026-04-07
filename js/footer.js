(() => {
  const mount = document.getElementById('footer');
  if (!mount) return;

  fetch('components/footer.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load footer component');
      }
      return response.text();
    })
    .then((html) => {
      mount.innerHTML = html;
    })
    .catch((error) => {
      console.error(error);
    });
})();
