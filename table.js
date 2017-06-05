/**
 * Created by Administrator on 2017/6/4.
 */
$.fn.extend({
	setTable: function (object) {
		var _this = this[0];
		_this.style.border = '1px solid #ddd'
		_this.style.borderCollapse = 'collapse';
		_this.style.borderSpacing = '0';
		var obj1=obj = {
			//初始化
			init: function (obj) {
				this.page(obj)

			},
			// 页面渲染
			render: function (obj) {
				this.headerRender(obj)

				this.dataRender(obj.currData || obj.data)
				this.style(obj)

			},
			dataRender: function (data) {
				$(_this).find('tbody').remove()
				var tbody = document.createElement('tbody');
				$(data).each(function (i,v) {
					var tr = document.createElement('tr');
					for (var k in this) {
						var td = document.createElement('td');
						td.innerHTML = this[k];
						tr.appendChild(td);
					}
					tbody.appendChild(tr)
				})
				_this.appendChild(tbody)
			},
			headerRender: function (obj) {
				var thead = document.createElement('thead');
				var tr = document.createElement('tr');
				$(obj.title).each(function (i) {
					var th = document.createElement('th');
					var i = document.createElement('i');
					i.className='fa fa-unsorted'
					i.style.marginLeft='5px'
					th.innerHTML = this;
					th.appendChild(i);
					th.style.cursor = 'pointer';
					tr.appendChild(th);
				})
				thead.appendChild(tr);
				_this.appendChild(thead)
			},
			//对数据排序
			sort: function (data,index,status) {
				
				function getName (index) {
					var i = 0;
					var name;
					for( var k in data[0]) {
						if (i==index) {
							name = k;
						}
						i++;
					}
					return name
				}
	
				var name = getName(index);

				//status=0 代表升序  1 代表降序
				if (status) {
					data.sort(function (a,b) {

						return Number(a[name]) - Number(b[name]);
					})
				}else {
					data.sort(function (a,b) {
						return -Number(a[name]) + Number(b[name]);
					})
				}
				console.log(data);
				//先移除
				$(_this).find('tbody').remove()
				//渲染页面
				this.dataRender(data)
				//设置样式
				this.style(object);

			},  
			data: function () {
				if (typeof object.data == 'string') {
					$.get(object.data).done((data)=>{
						var setObj = {
							//行宽和列高
							lineWidth: object.lineWidth || 200,
							lineHeight: object.lineHeight || 40,
							//标题行
							title: object.title,
							//隔行变色,默认为白色，不需设置
							color: {
								title: object.color.title || 'white',
								odd: object.color.odd || 'white',
								even: object.color.even || 'white',
								hover: object.color.hover || '#666'
							},
							//是否分页，默认不分页
							page: object.page || {status: false},
							//数据  在线url或者数组
							data: data
						}
						obj.init(setObj);
					}).fail((err)=>{
						alert('请求数据错误')
					})
				}else {
					var setObj = {
						//行宽和列高
						lineWidth: object.lineWidth || 200,
						lineHeight: object.lineHeight || 40,
						//标题行
						title: object.title,
						//隔行变色,默认为白色，不需设置
						color: {
							title: object.color.title || 'white',
							odd: object.color.odd || 'white',
							even: object.color.even || 'white',
							hover: object.color.hover || '#666'
						},
						//是否分页，默认不分页
						page: object.page || false,
						//数据  在线url或者数组
						data: object.data
					}
					obj.init(setObj)
				}
				return setObj;
			},
			//表格样式设置
			style: function (obj) {
				$(_this).find('thead tr').css({
					backgroundColor: obj.color.title,
				}).find('th').each(function () {
					$(this).css({
						height: obj.lineHeight,
						width : obj.lineWidth,
						border: '1px solid #ddd',
						borderBottom: '2px solid #ddd'
					})
				})

				$(_this).find('tbody td').each(function () {
					$(this).css({
						height: obj.lineHeight,
						width : obj.lineWidth,
						border: '1px solid #ddd',
					})
				})

				$(_this).find('tbody tr:odd').each(function () {
					$(this).css({
						backgroundColor: obj.color.odd
					})
				})

				$(_this).find('tbody tr:even').each(function () {
					$(this).css({
						backgroundColor: obj.color.even
					})
				})

				$(_this).find('tbody tr').hover(function () {
					this.prevColor = $(this).css('backgroundColor');
					$(this).css({backgroundColor: obj.color.hover})
				},function () {
					$(this).css({backgroundColor: this.prevColor});
				})


			},
			// 表头设置
			header: function (data) {
				//设置箭头
				$(_this).find('thead th').on('click',function (i) {
					if ($(this).children('i').hasClass('fa-unsorted')) {
						$(this).children('i').removeClass('fa-unsorted').addClass('fa-sort-desc').parent().siblings().children('i').removeClass('fa-sort-up fa-sort-desc').addClass('fa-unsorted');
						obj.sort(data,$(this).index(),0)
					}else if($(this).children('i').hasClass('fa-sort-desc')){
						$(this).children('i').removeClass('fa-sort-desc').addClass('fa-sort-up');
						obj.sort(data,$(this).index(),1)
					}else {
						$(this).children('i').removeClass('fa-sort-up').addClass('fa-sort-desc')
						obj.sort(data,$(this).index(),0)
					}
				})


			},
			// 分页设置
			page: function (obj) {
				if (obj.page.status) {
					//分页
					var div = document.createElement('div');
					div.className = 'down';
					div.style.display = 'inline-block';
					div.style.textAlign = 'center';
					div.style.marginTop = '5px';
					div.style.width = obj.lineWidth * obj.title.length + 'px';
					var index = Math.ceil(obj.data.length / obj.page.max);
					for(var i=0;i<index;i++){
						$('<a href="#">' + (i+1) + '</a>').appendTo(div)
					}

					$(div).children().css({
						display: 'inline-block',
						width: '25px',
						margin: '0 2px',
						textDecoration: 'none',
						border: '1px solid #ccc',
						lineHeight: '25px',
						color: '#8a8a8a',
					}).on('click',function () {
						$(this).css({
							backgroundColor: '#3897cd',
							color: '#fff',
							borderColor: '#3897cd'
						}).siblings().css({
							backgroundColor: '#fff',
							color: '#8a8a8a',
							borderColor: '#ccc'
						})

						//限定数据
						//每页显示的数据个数
						var pageDataLen = this.innerText < index ? obj.page.max : (obj.data.length - index * obj.page.max + obj.page.max);
						//每页显示的数据
						obj.currData = obj.data.slice($(this).index() * obj.page.max, $(this).index() * obj.page.max + pageDataLen);


						$(_this).find('thead').remove()
						obj1.headerRender(obj)
						obj1.dataRender(obj.currData || obj.data)
						obj1.style(obj)
						obj1.header(obj.currData);




					})
					$(_this).parent().append(div)
					$('.down a:first-child')[0].click();
				}else {
					//不分页
					this.render(obj)
					this.header(obj.data)
				}
			},

		}

		return _this.cyf=obj.data()
	}

});