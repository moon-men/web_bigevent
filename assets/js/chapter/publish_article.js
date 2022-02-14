$(function () {
  let layer = layui.layer;
  let form = layui.form;

  let article_state = "草稿";

  // 初始化文章类别下拉框数据
  initArticleCategory();

  // 初始化富文本编辑器
  initEditor();
  initPictureCrop();

  // 根据地址判断是否为文章列表修改按钮跳转过来的
  // let path = window.location.href.split('?')
  // let paths = window.location.href.split("?");
  // if (paths.length === 2) {
  //   // 从文章列表修改按钮跳转过来，要填充数据
  //   $(".layui-card-header").text("修改文章");
  //   // 获取到文章id
  //   let articleId = paths[1].split("=")[1];
  //   $.ajax({
  //     method: "GET",
  //     url: "/my/article/" + articleId,
  //     success: function (res) {
  //       if (res.status !== 0) return layer.msg(res.message);
  //       $('.layui-form [name="title"]').val(res.data.title);
  //       $('.layui-form [name="cate_id"]').val(res.data.cate_id);
  //       $(`#articleCategory dl [lay-value="${res.data.cate_id}"]`).addClass("lay-this layui-this")
  //       $('.layui-form [name="content"]').val(res.data.content);
  //       let options = {
  //         aspectRatio: 400 / 280,
  //         preview: ".img-preview",
  //       };
  //       $("#img")
  //         .cropper("destroy")
  //         .attr("src", res.data.cover_img)
  //         .cropper(options);
  //     },
    });
  }

  $("#selectCoverBtn").on("click", function (e) {
    e.preventDefault();
    $("#coverInput").click();
  });

  $("#upload").on("click", function (e) {
    article_state = "已发布";
  });

  $(".layui-card form").on("submit", function (e) {
    e.preventDefault();
    console.log(this);
    console.log($(this));
    console.log($(this)[0]);
    let formData = new FormData(this);
    formData.append("state", article_state);
    // 将封面裁剪过后的图片，输出为一个文件对象
    $("#image")
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象，存储到 fd 中
        formData.append("cover_img", blob);
        // 发起 ajax 数据请求
        publishArticle(formData);
      });
  });

  /**
   * 发布文章
   * @param {*} formDate FormDate对象
   */
  function publishArticle(formDate) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: formDate,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }
        layer.msg("发布文章成功！");
        // 发布文章成功后，跳转到文章列表页面
        location.href = "/chapter/chapterList.html";
      },
    });
  }

  /**
   * 初始化图片裁剪器
   */
  function initPictureCrop() {
    let $image = $("#image");

    // 裁剪选项
    let options = {
      aspectRatio: 400 / 280,
      preview: ".img-preview",
    };

    // 初始化裁剪区域
    $image.cropper(options);

    // 为文件选择框绑定 change 事件
    $("#coverInput").on("change", function (e) {
      console.log(e);
      // 获取用户选择的文件
      var filelist = e.target.files;
      if (filelist.length === 0) return;

      // 1. 拿到用户选择的文件
      var file = e.target.files[0];
      // 2. 将文件，转化为路径
      var imgURL = URL.createObjectURL(file);
      // 3. 重新初始化裁剪区域
      $image
        .cropper("destroy") // 销毁旧的裁剪区域
        .attr("src", imgURL) // 重新设置图片路径
        .cropper(options); // 重新初始化裁剪区域
    });
  }

  /**
   * 初始化文章类别下拉框
   */
  function initArticleCategory() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) return layer.msg("获取文章分类失败");
        let articleCategoryHtml = template("tpl-articleCategory", res);
        $("#articleCategory").html(articleCategoryHtml);
        form.render();
      },
    });
  }
});
