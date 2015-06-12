(function(global){
		var el,
			scrollListener,
			prevIndex = 0,
			appendCount = 0,
			pageAmout = 20,
			backScroll = false,//回滚操作标志
			noMoreNext = false,
			nextIndex = initItemNum = 6,
			lastScrollTop,
			showingItem,
			loadMoreAt = 3,//在第几页时开始加载更多, < initItemNum
			$list = document.getElementById('list'),
			$li = $list.getElementsByTagName('li'),
			itemHeight = parseInt(window.getComputedStyle($li[0], null).getPropertyValue('height'), 10),
			loadMore = function(index){
				index += prevIndex;
				return index >= loadMoreAt && (index + loadMoreAt) <= pageAmout
			},
			scrollDown = function(){
				return el.scrollTop - lastScrollTop >= 0
			},
			relocateScrollbar = function(){
				if(scrollDown()){
					el.scrollTop = el.scrollTop - itemHeight;
				} else {
					el.scrollTop = el.scrollTop + itemHeight;
				}

				backScroll = true;
			},

			init =  function(element){
				el = element;
				el.addEventListener('scroll', scrollListener = function(e){

					if(backScroll){
						backScroll = false;
						return;
					}
					
					for(var i = 0, l = $li.length; i < l; i++){
						var hiddenHeight = el.scrollTop - $li[i].offsetTop;

						
						if( hiddenHeight >= 0){
							//是否在滚动区域可见
							if(hiddenHeight <= itemHeight && loadMore(i)){
								
								if($li[i].isEqualNode(showingItem)){
									break;
								}

								showingItem = $li[i];

								if(scrollDown()) {//scroll down
									var newLi;

									if(!noMoreNext){
										newLi = document.createElement('li');
										newLi.innerHTML = ++nextIndex;
										$list.appendChild(newLi);
										appendCount++;

										//没有更多页面可加载
										if(nextIndex >= pageAmout){
											noMoreNext = true;
										}

										//append俩个元素，删除一个顶部元素
										//这样做是为了保证scrollbar有足够的去滚动出所有元素
										if(appendCount >= 2){
											appendCount = 0;
											$list.removeChild($li[0]);
											//删除顶部元素后(元素整体向上移动一个项的高度)，滚动条需重新定位到删除前的位置（相对于元素）
											relocateScrollbar();
											prevIndex++;
										}
									}

								} else {
									var newLi;

									//未到达首页
									if(prevIndex > 0){
										newLi = document.createElement('li');
										newLi.innerHTML = prevIndex--;

										$list.insertBefore(newLi, $li[0]);
										//删除顶部元素后(元素整体向下移动一个项的高度)，滚动条需重新定位到删除前的位置（相对于元素）
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