document.querySelector('#myfile').onchange = function(e) {
    let files = this.files;
    let reader = new FileReader();

    reader.onload = function (e) {
        console.log(e.target.result);
    };

    reader.readAsText(files[0]);

};
