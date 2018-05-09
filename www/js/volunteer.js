function show_main() {
    $('#body_main').css('display', 'block');
    $('#body_add').css('display', 'none');
    $('#body_view').css('display', 'none');
    $('#body_search').css('display', 'none');
}
function show_add() {
    $('#body_main').css('display', 'none');
    $('#body_add').css('display', 'block');
    $('#body_view').css('display', 'none');
    $('#body_search').css('display', 'none');
}
function show_view() {
    listVolunteer();
    $('#body_main').css('display', 'none');
    $('#body_add').css('display', 'none');
    $('#body_view').css('display', 'block');
    $('#body_search').css('display', 'none');
}
function show_search() {
    loadVolunteer();
    $('#body_main').css('display', 'none');
    $('#body_add').css('display', 'none');
    $('#body_view').css('display', 'none');
    $('#body_search').css('display', 'block');
}