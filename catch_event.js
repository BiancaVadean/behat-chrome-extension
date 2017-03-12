// document.addEventListener('click', function (event) {
//     chrome.storage.sync.clear();
//     // chrome.storage.sync.set({'events': []}, function() {});
//     chrome.storage.sync.get('events', function (items) {
//         console.log(items.events);
//         items.events.push(event.type);
//         console.log(items.events);
//         chrome.storage.sync.set(items, function(error) {
//             // console.log(error);
//             // service worker
//         });
//     });
// });

// var fn = function() {
//   var a = document.querySelector('#innerControl_txtAnnualDays').value;
//     console.log(a);
// };

window.onload = function ()
{
    var a = document.querySelector('#innerControl_txtAnnualDays').value;
    alert(a);
}


