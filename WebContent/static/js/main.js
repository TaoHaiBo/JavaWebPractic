$(document).ready(() => {
  var URL = 'http://localhost:8080/MyBooks/API/';
  // 表格
  var bId = $("#table");
  // 书号 书名 出版社
  var bId = $("#Bid");
  var bName = $("#Bname");
  var bPress = $("#Bpress");
  // 出版 年 月 日
  var bDateYear = $("#Bdate_year");
  var bDateMonth = $("#Bdate_month");
  var bDateDay = $("#Bdate_day");
  // 增、改的弹窗
  var myModal = $("#myModal");
  var myModalLabel = $("#myModalLabel");
  // 增删改查按钮
  var btnAdd = $("#btn_add");
  var btnDelete = $("#btn_delete");
  var btnEdit = $("#btn_edit");
  var btnQuery = $("#btn_query");
  // 提交按钮
  var btnSubmit = $("#btn_submit");

  // 初始化表格插件
  InitTable();

  btnAdd.click(() => {
    var bIds = [];
    var getSelectRows = $("#table").bootstrapTable("getData", (books) => { return books });
    $.each(getSelectRows, (i, book) => { bIds.push(book.Bid) });
    if (bIds.length == 0) {
    	bId.val(1);
    } else {
    	var max = Math.max.apply(null, bIds);
    	bId.val(max + 1);
    }
    bName.val('');
    bPress.val('');
    bDateYear.val('');
    bDateMonth.val('');
    bDateDay.val('');
    myModalLabel.text('添加一本图书');
    btnSubmit.attr("form", "INSERT");
    myModal.modal('show');
  });

  btnEdit.click(() => {
    var getSelectRows = $("#table").bootstrapTable("getSelections", (books) => { return books });
    if (getSelectRows.length != 1) {
      alert("没有选中行或者选了多行");
    } else {
      var book = getSelectRows[0];
      var date = book.Bdate.split('-');
      bId.val(book.Bid);
      bName.val(book.Bname);
      bPress.val(book.Bpress);
      bDateYear.val(date[0]);
      bDateMonth.val(date[1]);
      bDateDay.val(date[2]);
      myModalLabel.text('编辑图书信息');
      btnSubmit.attr("form", "UPDATE");
      myModal.modal('show');
    }
  });

  btnSubmit.click(() => {
    var btn_status = btnSubmit.attr("form");
    if (Judge()) {
    	var bDate = bDateYear.val().toString() + '-' + bDateMonth.val().toString() + '-' + bDateDay.val().toString();
    	if (btn_status === "UPDATE") {
    		var UPDATE_JSON = {
    			"Bid": parseInt(bId.val()),
    			"Bname": bName.val().toString(),
    			"Bpress": bPress.val().toString(),
    			"Bdate": bDate
    		}
    		myModal.modal('hide');
    		$.ajax({
    			url: URL + "UPDATE",
    			type: "POST",
    			dataType: "text",
    			data: JSON.stringify(UPDATE_JSON),
    			success: (result) => {
    				if (result === "true") {
    	              $("#table").bootstrapTable("refresh", {});
    	            } else {
    	              alert("更新操作未成功");
    	            }
    	        },
    		});
    	}
    	if (btn_status === "INSERT") {
    		var INSERT_JSON = {
    			"Bid": parseInt(bId.val()),
    			"Bname": bName.val().toString(),
    			"Bpress": bPress.val().toString(),
    			"Bdate": bDate
    		}
    		myModal.modal('hide');
    		$.ajax({
    	          url: URL + 'INSERT',
    	          type: "POST",
    	          dataType: "text",
    	          data: JSON.stringify(INSERT_JSON),
    	          success: (result) => {
    	            if (result === "true") {
    	              $("#table").bootstrapTable("refresh", {});
    	            } else {
    	              alert("增加操作未成功");
    	            }
    	          },
    	        });
    	}
    }
  });

  $("#btn_delete").click(() => {
    var getSelectRows = $("#table").bootstrapTable("getSelections", (books) => { return books });
    if (getSelectRows.length > 0) {
      var s = "";
      $.each(getSelectRows, (i, book) => { s = s + book.Bid + ',' });
      s = s.substring(0, s.length - 1);
      $.post(URL + 'DELETE', { Bid: s }, (result) => {
          if (result === "true") {
            $("#table").bootstrapTable("refresh", {});
          }
      });
    } else {
      alert("未选择行");
    }
  });

  $('#btn_query').click(() => { $("#table").bootstrapTable("refresh", {}); });
  
  function Judge() {
	  var reg_year = new RegExp("^[0-9]*$");
	  var reg_month = new RegExp("^[0-9]*$");
	  var reg_day = new RegExp("^[0-9]*$");
	  if (bName.val() === '' || bName.val().length === 0) {
	      alert("还没有输入书名");
	      bName.css("border-color", "#FF0000");
	      bName.val('');
	      bName.focus();
	      return false;
	  } else {
		 bName.css("border-color", "#ccc");
	  }

	    if (bPress.val() === '' || bPress.val().length === 0) {
	        alert("还没有输入出版社");
	        bPress.css("border-color", "#FF0000");
	        bPress.val('');
	        bPress.focus();
	        return false;
	    }else {
	    	bPress.css("border-color", "#ccc");
		  }
	    
	    if (bDateYear.val() === '' || bDateYear.val().length < 4) {
	        bDateYear.css("border-color", "#FF0000");
	        bDateYear.val('');
	        return false;
	    } else {
	    	bDateYear.css("border-color", "#ccc");
		  }
	    if (!reg_year.test(bDateYear.val()) || bDateYear.val() > 2018 || bDateYear.val() < 1970) {
		      alert("年份 1970-2018");
		      bDateYear.css("border-color", "#FF0000");
		      bDateYear.val('');
		      bDateYear.focus();
		      return false;
		    } else {
		    	bDateYear.css("border-color", "#ccc");
			  }
	    
	    if (bDateMonth.val() === '' || bDateMonth.val().length < 2) {
	    	alert("月份01-12，格式：01");
	    	bDateMonth.css("border-color", "#FF0000");
	    	bDateMonth.val('');
	    	return false;
	    }else {
	    	bDateMonth.css("border-color", "#ccc");
		  }
	    
	    if (!reg_month.test(bDateMonth.val()) || bDateMonth.val() < 0 || bDateMonth.val() > 12) {
	    	alert("月份 01-12");
	    	bDateMonth.css("border-color", "#FF0000");
	    	bDateMonth.val('');
	    	bDateMonth.focus();
	    	return false;
	    } else {
	    	bDateMonth.css("border-color", "#ccc");
		  }
	    
	    if (bDateDay.val() === '' || bDateDay.val().length < 2) {
	    	alert("天数 01-31，格式：01");
	    	bDateDay.css("border-color", "#FF0000");
	    	bDateDay.val('');
	    	return false;
	    }else {
	    	bDateDay.css("border-color", "#ccc");
		  }
	    
	    if (!reg_day.test(bDateDay.val()) || bDateDay.val() < 0 || bDateDay.val() > 31) {
	    	alert("天数 01-31");
	    	bDateDay.css("border-color", "#FF0000");
	    	bDateDay.val('');
	    	bDateDay.focus();
	    	return false;
	    }else {
	    	bDateDay.css("border-color", "#ccc");
		  }
	    return true;
  }

  function InitTable() {
    $('#table').bootstrapTable({
      url: URL,
      // 工具按钮的容器
      toolbar: '#toolbar',
      // 是否启用点击选中行
      clickToSelect: true,
      // 是否显示行间隔色
      striped: true,
      // 分页方式
      sidePagination: 'client',
      // 是否显示分页（*）
      pagination: true,
      // 初始化table时显示的页码
      pageNumber: 1,
      // 每页条目
      pageSize: 10,
      // 可供选择的每页的行数（*）
      pageList: [10, 25, 50, 100],
      // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
      cache: false,
      // 是否启用排序
      sortable: true,
      // 排序方式
      sortOrder: "asc",
      // 是否显示表格搜索
      search: false,
      // 是否显示所有的列
      showColumns: true,
      // 是否显示刷新按钮
      showRefresh: true,
      // 每一行的唯一标识，一般为主键列
      uniqueId: "Bid",
      // key值栏位
      idField: 'Bid',
      // 字段和列名
      columns: [{
          checkbox: true,
        },
        {
          field: 'Bid',
          title: '书号',
          sortable: true,
        },
        {
          field: 'Bname',
          title: '书名'
        },
        {
          field: 'Bpress',
          title: '出版社',
        },
        {
          field: 'Bdate',
          title: '出版日期',
         },],
    });
  }
});