$(function () {
  let form = layui.form;

  // 初始化页面数据
  initData();

  // 点击添加分类按钮监听事件
  $("#add").on("click", function () {
    let dialogAdd = createDiaLog("添加文章分类", $("#dialog-add").html());
    // 确认添加分类事件
    $("body").on("submit", "#add-form", function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: "/my/article/addcates",
        data: $(this).serialize(),
        success: function (res) {
          if (res.status !== 0) return layui.layer.msg(res.message);
          layui.layer.msg(res.message);
          layui.layer.close(dialogAdd);
          initData();
        },
      });
    });
  });

  // 添加分类弹出层的重置
  $("#reset").on("click", function (e) {
    e.preventDefault();
    $('.layui-form name="name"').val("");
    $('.layui-form name="alias"').val("");
  });

  // 删除分类
  $("body").on("click", "#del", function () {
    let id = $(this).attr("data-id");
    layui.layer.confirm(
      `是否删除序号${id}的文章分类`,
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        $.ajax({
          method: "GET",
          url: `/my/article/deletecate/${id}`,
          success: function (res) {
            if (res.status !== 0) return layui.layer.msg(res.message);
            initData();
            layui.layer.msg(res.message);
          },
        });
        layer.close(index);
      }
    );
  });

  // 修改分类
  $("body").on("click", "#edit",function () {
    // 创建弹出层
    let dialogEdit = createDiaLog('修改文章分类', $('#dialog-edit').html());
    let id = $(this).attr('data-id');
    // 填充表单数据
    $.ajax({
      method: 'GET',
      url: `/my/article/cates/${id}`,
      success: function(res){
        if(res.status !== 0) return layui.layer.msg(res.message);
        form.val("eidt-from", res.data);
      }
    })

    // 提交表单
    $("body").on('submit', '#edit-form', function (e) {
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: "/my/article/updatecate",
        data: form.val("eidt-from"),
        success: function(res){
          if(res.status !== 0) return layui.layer.msg(res.message);
          layui.layer.msg(res.message);
          layui.layer.close(dialogEdit);
          initData();
        }
      })
    })
  });
});

/**
 * 创建添加分类的弹出层
 * @param {*} dialogTitle 弹出层标题
 * @param {*} contentElement 弹出层内容区的HTML元素
 * @param {*} width 弹出层的宽度，默认位：500px
 * @param {*} height 弹出层的宽度，默认位：250px
 * @return 弹出层标识
 */
function createDiaLog(dialogTitle, contentElement, width, height) {
  if (!width) {
    width = "500px";
  } else {
    width += "px";
  }
  if (!height) {
    height = "250px";
  } else {
    height += "px";
  }
  let layer = layui.layer;
  let dialogAdd = layer.open({
    type: 1,
    title: [dialogTitle, "font-size:14px;"],
    // title: ["添加文章分类", "font-size:14px;"],
    area: [width, height],
    content: contentElement,
    // content: $("#dialog-add").html(),
  });
  return dialogAdd;
}

/**
 * 初始化页面表格数据
 */
function initData() {
  $.ajax({
    method: "GET",
    url: "/my/article/cates",
    success: function (res) {
      if (res.status !== 0) return layui.layer.msg(res.message);
      let tableData = template("tpl-table", res);
      $(".layui-table tbody").empty();
      $(".layui-table tbody").append(tableData);
    },
  });
}
