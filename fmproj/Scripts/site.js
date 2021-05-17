var loadFile = function(event,id) {
    var image = document.getElementById('output'+id);
    image.src = URL.createObjectURL(event.target.files[0]);
};
// var SetFileId = function(_id){
//     id = _id
//     console.log(id);
// }
// alert("helo world");
