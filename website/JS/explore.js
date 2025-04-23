// Fetch navbar and footer content
fetch('navbar.html')
  .then(res => res.text())
  .then(data => document.getElementById('navbar').innerHTML = data);

fetch('footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data);

// Category filter functionality
$(document).ready(function () {
    $('.nav-pills .nav-link').on('click', function (e) {
        e.preventDefault();
        // Just move the active class, no filtering
        $('.nav-pills .nav-link').removeClass('active');
        $(this).addClass('active');
    });
});
