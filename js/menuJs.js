// JavaScript Document

$(document).ready(function() {
    $(".toggle").click(function() {
        $(this).toggleClass("active");
        $(".nav").slideToggle();
    });
    $(".nav > ul > li:has(ul) > a").append('<div class="arrow-bottom"></div>');
	//.nav > ul > li:has(ul) > a 是若有第二層選單則顯示指示箭頭
});
