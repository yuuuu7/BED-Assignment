$(document).ready(function() {
    // Activate the carousel
    $("carousel1").carousel();

    // Set the sliding interval to 5 seconds (5000 milliseconds)
    $("#carousel1").carousel({
        interval: 4000
    });
});

//Navbar Script
window.addEventListener('scroll', function() {
    // Get the height of the header/navbar
    const headerHeight = document.querySelector('.header').offsetHeight;
  
    // Set the scroll position at which you want the fade effect to start
    const scrollTrigger = headerHeight / 2;
  
    // Get the current scroll position
    const scrollY = window.scrollY;
  
    // Calculate the opacity based on the scroll position
    const opacity = Math.min(1, scrollY / scrollTrigger);
  
    // Apply the background color with the calculated opacity
    document.querySelector('.header').style.backgroundColor = `rgba(51, 51, 51, ${opacity})`;
    });


