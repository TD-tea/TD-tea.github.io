// const gifSrc = 'images/bongocat.gif';
        
// // Show the cat when clicking anywhere on the page
// document.addEventListener('click', function(e) {
//     // Create a new bongo cat element
//     const bongoCat = document.createElement('img');
//     bongoCat.className = 'bongoCat';
//     bongoCat.src = gifSrc;
//     bongoCat.alt = 'Bongo Cat';
            
//     // Position the cat at the cursor
//     bongoCat.style.left = e.clientX + 'px';
//     bongoCat.style.top = e.clientY + 'px';
            
//     // Add the cat to the document
//     document.body.appendChild(bongoCat);
            
//     // Remove the cat after the GIF animation completes (approximately 1.5 seconds)
//     setTimeout(() => {
//            bongoCat.remove();
//     }, 1500);
// });

const bongoCat = document.getElementById('bongoCat');
const gifSrc = bongoCat.src;
        
// Show the cat when clicking anywhere on the page
document.addEventListener('click', function(e) {
    // Position the cat at the cursor
    bongoCat.style.left = e.clientX + 'px';
    bongoCat.style.top = e.clientY + 'px';
            
    bongoCat.style.display = 'block';
    // Reset the GIF source to make it play from the beginning
    bongoCat.src = '';
    setTimeout(() => {
        bongoCat.src = gifSrc;
    }, 10);
            
    // Hide the cat after 0.5 seconds
    setTimeout(() => {
        bongoCat.style.display = 'none';
    }, 1000);
});