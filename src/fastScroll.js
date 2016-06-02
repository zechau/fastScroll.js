(function(global){
	var el,
	scrollListener,
	prevIndex = 0,
	appendCount = 0,
	pageAmout = 20,
	backScroll = false,//flag of scrolling back
	noMoreNext = false,
	nextIndex = initItemNum = 6,
	lastScrollTop,
	showingItem,
	loadMoreAt = 3,//load more items after scroll out the very number of pages, < initItemNum
	$list = document.getElementById('list'),
	$li = $list.getElementsByTagName('li'),
	itemHeight = $li[0].offsetHeight,
	
	loadMore = function(index){
		index += prevIndex;
		return index >= loadMoreAt && (index + loadMoreAt) <= pageAmout
	},
	scrollDown = function(){
		return el.scrollTop - lastScrollTop >= 0;
	},
	relocateScrollbar = function(){
		if(scrollDown()){
			el.scrollTop = el.scrollTop - itemHeight;
		} else {
			el.scrollTop = el.scrollTop + itemHeight;
		}

		backScroll = true;
	},

	init =  function(options){
		el = options.element;
		el.addEventListener('scroll', scrollListener = function(e){

			if(backScroll){
				backScroll = false;
				return;
			}
			
			for(var i = 0, l = $li.length; i < l; i++){
				var top = $li[i].getBoundingClientRect().top;
				var list_offset = $list.offsetTop + $list.clientTop;
				//li element in view
				if(el.scrollTop + el.clientHeight  >= $li[i].offsetTop -  list_offset&&
						el.scrollTop  <= ($li[i].offsetTop - list_offset) + $li[i].offsetHeight){

						if($li[i].isEqualNode(showingItem) || !loadMore(i)){
							break;
						}

						showingItem = $li[i];

						if(scrollDown()) {
							var newLi;

							if(!noMoreNext){
								newLi = document.createElement('li');
								newLi.innerHTML = ++nextIndex;
								$list.appendChild(newLi);
								appendCount++;

								//no more pages 
								if(nextIndex >= pageAmout){
									noMoreNext = true;
								}

								//增加俩个以上的列表项后删除一个列表项，才能产生无限下拉的效果
								if(appendCount >= 2){
									appendCount = 0;
									$list.removeChild($li[0]);
									//删除页面元素时，内容会发生移位，需要调整滚动条的位置来消除位移影响
									relocateScrollbar();
									prevIndex++;
								}
							}

						} else {
							var newLi;

							//has more previous pages to load
							if(prevIndex > 0){
								newLi = document.createElement('li');
								newLi.innerHTML = prevIndex--;

								$list.insertBefore(newLi, $li[0]);
								relocateScrollbar();
							}
							
							if($li.length > initItemNum){
								$list.removeChild($li[$li.length - 1]);
								nextIndex --;
								noMoreNext = false;
							}
						}

						lastScrollTop = el.scrollTop;
						break;
				}
			}
		}, false);

		return this;
	},

	destroy = function(){
		el.removeEventListener('scroll', scrollListener, false);
	};

	global.FastScroll =  function(){};
	FastScroll.prototype = {
		'constructor': FastScroll,
		'init': init,
		'destroy': destroy
	}
})(window);