function add() {
    
    var name = document.getElementById('field').value;
    
    var text = "<p class='person' onclick='start()'>" + name + "</p>";
    $('#namelist').append(text);

};

function start() {
    document.getElementById('current').innerHTML = this.innerHTML;

}
