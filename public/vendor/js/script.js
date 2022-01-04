let navMenu = document.getElementById("resume")
navMenu.classList.add("active-1");



const textes = document.querySelectorAll(".typewriter span")
let prevText = textes[textes.length - 1]
let i = 0

animate()
setInterval(() => animate(), 5000)

function animate() {
    let index = (i++) % textes.length

    prevText.style.display = "none"
    textes[index].style.display = "block"

    prevText = textes[index]
}

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth();

let startWork = new Date("2019-04-08");
let bvtWork = new Date("2021-04-05");

function calcDate(date1, date2) {
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;

    var days = Math.floor(diff / day);
    var months = Math.floor(days / 30);
    var years = Math.floor(months / 12);

    var monthsCount = months % 12;

    return [years, monthsCount]
}

let workTime = calcDate(today, startWork)
let currentWorkTime = calcDate(today, bvtWork)
let timeWork = document.getElementById("work-time").innerHTML = `${workTime[0]} Years, ${workTime[1]} Months`;
let currWork = document.getElementById("curr-work").innerHTML = `<strong>${currentWorkTime[1]} Months </strong>`;


$('.neumorphic-slider__thumb').on('mousedown', function () {
    $(document).on('mousemove.mm', function (e) {
        var new_value = 100;
        // if (e.clientX < $('.neumorphic-slider').offset().left) {
        //     new_value = '0%';
        // } else if (e.clientX > $('.neumorphic-slider').offset().left + $('.neumorphic-slider').width() - 10) {
        //     new_value = '100%';
        // } else {
        //     new_value = ((e.clientX - $('.neumorphic-slider').offset().left) / ($('.neumorphic-slider').width() - 10) * 100).toFixed(0) + '%';
        // }
        // document.documentElement.style.setProperty('--value', new_value);
        $('.neumorphic-slider__popover').text(`You can't break it ${new_value}%!`).css({ 'color': '#b62828', });
    });
    $(document).on('mouseup.mu', function () {
        $(document).off('mousemove.mm');
        $('.neumorphic-slider__thumb').off('mouseup.mu');
    });
});


const countEl = document.getElementById('total-viewer');

updateVisitCount();

function updateVisitCount() {
    fetch('https://api.countapi.xyz/update/florin-popcom/codepen/?amount=1')
        .then(res => res.json())
        .then(res => {
            countEl.innerHTML = `${res.value}`;
        })
}