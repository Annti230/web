// JavaScript Document
$(function(){
		// 取得 .abgne-block-20110806 及其子孫元素 li
		var $block = $('.abgne-block-20110806'), 
			$li = $block.find('li');
		
		// 從 li 中取出超連結及大圖片來產生新的內容
		var _html = '';
		$li.each(function(){
			var $this = $(this), 
				$a = $this.find('a'),  
				$thumb = $a.find('img')

			_html += '<a href="' + $a.attr('href') + '"><img src="' + $thumb.attr('src').replace(/(\.[^\.]+)$/, '-big$1') + '" /></a>';
		});

		// 把產生的新內容加到 $block 中
		// 並先隱藏除了第一個以外的元素
		var $link = $block.append(_html).children('a').css({
		position: 'absolute', 
			opacity: 0
		}).eq(0).animate({
			opacity: 1, 
			zIndex: 10
		}).end();

		// 當 $li 點擊時
		$li.click(function(){
			// 顯示相對索引的 $link 並把其它的設為透明
			$link.eq($(this).index()).stop().animate({
				opacity: 1, 
				zIndex: 10
			}).siblings('a').stop().animate({
				opacity: 0, 
				zIndex: 0
			});

			return false;
		});

		$block.find('a').focus(function(){
			this.blur();
		});
	});