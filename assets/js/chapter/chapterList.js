$(function () {
  let layer = layui.layer;
  let form = layui.form;
  // 查询文章条件
  let query = {
    pagenum: 1, // 页码
    pagesize: 2, // 每页显示数据条数
  };

  initCategory();

  // 初始化页面数据
  initData(query);

  $(".filter-wrapper form").on("submit", function (e) {
    e.preventDefault();
    query.cate_id = $("#categorySelect").val();
    query.state = $("#state").val();
    initData(query);
  });

  $("#resetBtn").on("click", function () {
    query.cate_id = null;
    query.state = null;
    initData(query);
  });

  // $(".chapterTable tbody").on("click", ".edit", function () {
  //   window.location.href = "/chapter/publish_article.html?id=" +$(this).attr('data-id');
  // });

  $(".chapterTable tbody").on("click", ".del", function () {
    let id = $(this).attr("data-id");
    layer.confirm(`是否删除?`, { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg(res.message);
          layer.msg(res.message);
          initData(query);
        },
      });
      layer.close(index);
    });

  });

  /**
   * 初始化分类下拉框
   */
  function initCategory() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) return layer.msg("获取文章分类失败");
        let categoryHtml = template("tpl-category", res);
        $("#category").html(categoryHtml);
        form.render();
      },
    });
  }

  /**
   * 初始化页面数据
   * @param {*} query 查询条件对象
   */
  function initData(query) {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: query,
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message);
        let dataListHtml = template("tpl-dataList", res);
        $(".chapterTable tbody").html(dataListHtml);
        renderPage(res.total);
      },
    });
  }

  /**
   * 渲染分页
   * @param {*} totalPageSize 总记录数
   */
  function renderPage(total) {
    layui.use("laypage", function () {
      var laypage = layui.laypage;

      //执行一个laypage实例
      laypage.render({
        elem: "page", //注意，这里的 test1 是 ID，不用加 # 号
        count: total, //数据总数，从服务端得到
        limit: query.pagesize,
        curr: query.pagenum,
        limits: [2, 4, 6, 8, 10],
        layout: ["count", "limit", "prev", "page", "next", "skip"],
        jump: function (obj, first) {
          //obj包含了当前分页的所有参数，比如：
          // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
          // console.log(obj.limit); //得到每页显示的条数
          query.pagenum = obj.curr;
          query.pagesize = obj.limit;
          //首次不执行
          if (!first) {
            //do something
            initData(query);
          }
        },
      });
    });
  }
});
