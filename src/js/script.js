document.addEventListener('DOMContentLoaded', function (event) {

    function mediaChange(e) {
        if (e.matches) {
            console.log('mobile!')
        } else {
            console.log('desktop!')
        }
    }
    mediaQueryMobile.addListener(mediaChange)
    mediaChange(mediaQueryMobile)
    
});