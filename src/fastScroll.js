(function(global){
		var el,
			scrollListener,
			prevIndex = 0,
			appendCount = 0,
			pageAmout = 20,
			backScroll = false,//�ع�������־
			noMoreNext = false,
			nextIndex = initItemNum = 6,
			lastScrollTop,
			showingItem,
			loadMoreAt = 3,//�ڵڼ�ҳʱ��ʼ���ظ���, < initItemNum
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
							//�Ƿ��ڹ�������ɼ�
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

										//û�и���ҳ��ɼ���
										if(nextIndex >= pageAmout){
											noMoreNext = true;
										}

										//append����Ԫ�أ�ɾ��һ������Ԫ��
										//��������Ϊ�˱�֤scrollbar���㹻��ȥ����������Ԫ��
										if(appendCount >= 2){
											appendCount = 0;
											$list.removeChild($li[0]);
											//ɾ������Ԫ�غ�(Ԫ�����������ƶ�һ����ĸ߶�)�������������¶�λ��ɾ��ǰ��λ�ã������Ԫ�أ�
											relocateScrollbar();
											prevIndex++;
										}
									}

								} else {
									var newLi;

									//δ������ҳ
									if(prevIndex > 0){
										newLi = document.createElement('li');
										newLi.innerHTML = prevIndex--;

										$list.insertBefore(newLi, $li[0]);
										//ɾ������Ԫ�غ�(Ԫ�����������ƶ�һ����ĸ߶�)�������������¶�λ��ɾ��ǰ��λ�ã������Ԫ�أ�
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